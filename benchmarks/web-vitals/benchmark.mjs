import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const benchmarkDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(benchmarkDirectory, '..', '..')
const resultsDirectory = path.join(benchmarkDirectory, 'results')
const host = '127.0.0.1'
const port = Number(process.env.WEB_VITALS_PORT || 4173)
const runsPerRoute = Number(process.env.WEB_VITALS_RUNS || 5)
const phase = process.env.WEB_VITALS_PHASE || 'baseline'
const baseUrl = `http://${host}:${port}`
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const routes = [
  { id: 'home', path: '/', label: 'Home' },
  { id: 'quiz', path: '/quiz', label: 'Quiz' },
  { id: 'types', path: '/types', label: 'Type list' },
]

const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    throttlingMethod: 'simulate',
    disableStorageReset: false,
  },
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      shell: process.platform === 'win32',
      stdio: 'inherit',
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} exited with code ${code}`))
    })
  })
}

function startPreviewServer() {
  const viteCli = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js')
  const child = spawn(
    process.execPath,
    [
      viteCli,
      'preview',
      '--host',
      host,
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  child.stdout.on('data', (chunk) => process.stdout.write(chunk))
  child.stderr.on('data', (chunk) => process.stderr.write(chunk))
  return child
}

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // The preview process may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Preview server did not start within ${timeoutMs} ms`)
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

function round(value, digits = 2) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function auditValue(lhr, id) {
  const value = lhr.audits[id]?.numericValue
  if (!Number.isFinite(value)) {
    throw new Error(`Lighthouse audit "${id}" did not return a numeric value`)
  }
  return value
}

function extractRun(lhr) {
  return {
    firstContentfulPaintMs: round(auditValue(lhr, 'first-contentful-paint')),
    largestContentfulPaintMs: round(auditValue(lhr, 'largest-contentful-paint')),
  }
}

function summarize(runs) {
  const keys = [
    'firstContentfulPaintMs',
    'largestContentfulPaintMs',
  ]

  return Object.fromEntries(
    keys.map((key) => [key, round(median(runs.map((run) => run[key])))]),
  )
}

function printSummary(routeResults) {
  console.table(
    routeResults.map(({ label, median: values }) => ({
      route: label,
      FCP_ms: values.firstContentfulPaintMs,
      LCP_ms: values.largestContentfulPaintMs,
    })),
  )
}

async function main() {
  if (!Number.isInteger(runsPerRoute) || runsPerRoute < 1) {
    throw new Error('WEB_VITALS_RUNS must be a positive integer')
  }

  await runCommand(npmCommand, ['run', 'build'])
  const preview = startPreviewServer()
  let chrome

  try {
    await waitForServer()
    chrome = await launch({
      chromePath: process.env.CHROME_PATH,
      chromeFlags: [
        '--headless=new',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
      ],
    })

    const routeResults = []
    for (const route of routes) {
      const runs = []
      console.log(`[${route.label}] Lighthouse warm-up (not recorded)`)
      await lighthouse(
        `${baseUrl}${route.path}`,
        {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
        },
        lighthouseConfig,
      )

      for (let index = 0; index < runsPerRoute; index += 1) {
        console.log(`[${route.label}] Lighthouse run ${index + 1}/${runsPerRoute}`)
        const result = await lighthouse(
          `${baseUrl}${route.path}`,
          {
            port: chrome.port,
            output: 'json',
            logLevel: 'error',
          },
          lighthouseConfig,
        )
        runs.push(extractRun(result.lhr))
      }

      routeResults.push({
        id: route.id,
        label: route.label,
        path: route.path,
        runs,
        median: summarize(runs),
      })
    }

    const report = {
      schemaVersion: 1,
      phase,
      generatedAt: new Date().toISOString(),
      protocol: {
        source: 'Vite production build served by vite preview',
        browser: 'local Google Chrome launched headlessly',
        lighthouseVersion: '12.8.2',
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        runsPerRoute,
        aggregation: 'median',
        routes: routes.map(({ id, path: routePath }) => ({ id, path: routePath })),
      },
      routes: routeResults,
    }

    await mkdir(resultsDirectory, { recursive: true })
    const outputPath = path.join(resultsDirectory, `${phase}.json`)
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    printSummary(routeResults)
    console.log(`Saved ${phase} report to ${path.relative(projectRoot, outputPath)}`)
  } finally {
    if (chrome) await chrome.kill()
    preview.kill()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
