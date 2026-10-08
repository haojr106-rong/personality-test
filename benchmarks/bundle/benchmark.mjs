import { spawn } from 'node:child_process'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const benchmarkDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(benchmarkDirectory, '..', '..')
const distDirectory = path.join(projectRoot, 'dist')
const manifestPath = path.join(distDirectory, '.vite', 'manifest.json')
const resultsDirectory = path.join(benchmarkDirectory, 'results')
const phase = process.env.BUNDLE_PHASE || 'baseline'
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

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

function collectInitialChunkKeys(manifest, entryKey) {
  const collected = new Set()

  function visit(key) {
    if (collected.has(key)) return
    const chunk = manifest[key]
    if (!chunk) throw new Error(`Manifest chunk not found: ${key}`)

    collected.add(key)
    for (const importedKey of chunk.imports ?? []) visit(importedKey)
  }

  visit(entryKey)
  return [...collected]
}

function roundKilobytes(bytes) {
  return Math.round((bytes / 1000) * 100) / 100
}

async function main() {
  await runCommand(npmCommand, ['run', 'build', '--', '--manifest'])

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const entry = Object.entries(manifest).find(([, chunk]) => chunk.isEntry)
  if (!entry) throw new Error('Vite manifest does not contain an entry chunk')

  const [entryKey] = entry
  const initialChunkKeys = collectInitialChunkKeys(manifest, entryKey)
  const files = []

  for (const key of initialChunkKeys) {
    const chunk = manifest[key]
    if (!chunk.file.endsWith('.js')) continue

    const contents = await readFile(path.join(distDirectory, chunk.file))
    files.push({
      file: chunk.file,
      rawBytes: contents.byteLength,
      gzipBytes: gzipSync(contents).byteLength,
    })
  }

  const totals = files.reduce(
    (result, file) => ({
      rawBytes: result.rawBytes + file.rawBytes,
      gzipBytes: result.gzipBytes + file.gzipBytes,
    }),
    { rawBytes: 0, gzipBytes: 0 },
  )

  const report = {
    schemaVersion: 1,
    phase,
    generatedAt: new Date().toISOString(),
    protocol: {
      source: 'Vite production build manifest',
      scope: 'JavaScript entry chunk and transitive static imports',
      compression: 'Node.js gzipSync, summed per emitted file',
      excludes: 'dynamic imports and non-JavaScript assets',
    },
    entry: entryKey,
    files,
    totals: {
      ...totals,
      rawKilobytes: roundKilobytes(totals.rawBytes),
      gzipKilobytes: roundKilobytes(totals.gzipBytes),
    },
  }

  await mkdir(resultsDirectory, { recursive: true })
  const outputPath = path.join(resultsDirectory, `${phase}.json`)
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  console.table(
    files.map((file) => ({
      file: file.file,
      raw_kB: roundKilobytes(file.rawBytes),
      gzip_kB: roundKilobytes(file.gzipBytes),
    })),
  )
  console.log(`Initial JS: ${report.totals.rawKilobytes} kB raw, ${report.totals.gzipKilobytes} kB gzip`)
  console.log(`Saved ${phase} report to ${path.relative(projectRoot, outputPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
