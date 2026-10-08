# Initial JavaScript bundle benchmark

This benchmark measures the JavaScript required for the application's initial
page load. It creates a Vite production build with a manifest, starts at the
HTML entry, follows only static imports, and excludes route-level dynamic
imports and non-JavaScript assets.

## Run

```bash
npm run benchmark:bundle
```

The default result is stored at
`benchmarks/bundle/results/baseline.json`. To preserve the baseline and write
the optimized result in PowerShell:

```powershell
$env:BUNDLE_PHASE='optimized'
npm run benchmark:bundle
```

## Metrics

The report records the initial JavaScript payload in raw bytes and Gzip bytes.
Gzip is calculated independently for every emitted JavaScript file and then
summed, matching the fact that browsers download chunks as separate responses.

This is a deterministic build-size measurement rather than a runtime timing.
Before/after comparisons must use the same source fixture, dependency versions,
Node.js version, Vite version, and compression method.

## Optimization result

The initial JavaScript payload changed from `123.70 kB` to `101.87 kB` raw
(`17.65%` lower) and from `51.08 kB` to `40.15 kB` Gzip (`21.41%` lower).
The full quiz store and question data now load only when a route needs them.
Raw reports are preserved in `results/baseline.json` and
`results/optimized.json`.
