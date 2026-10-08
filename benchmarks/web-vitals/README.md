# Web Vitals benchmark

This benchmark records reproducible laboratory measurements for the initial-load
optimization. It builds the application for production, serves the generated
files with `vite preview`, and measures three public routes with Lighthouse.

## Run

```bash
npm run benchmark:web-vitals
```

The default protocol runs each route five times with Lighthouse's simulated
mobile throttling, discards one warm-up run per route, and stores the median in
`benchmarks/web-vitals/results/baseline.json`.

Optional environment variables:

- `WEB_VITALS_RUNS`: positive number of runs per route; defaults to `5`.
- `WEB_VITALS_PHASE`: output filename and report phase; defaults to `baseline`.
- `WEB_VITALS_PORT`: local preview port; defaults to `4173`.
- `CHROME_PATH`: explicit Chrome executable path when automatic detection fails.

## Routes and metrics

The fixed route set is `/`, `/quiz`, and `/types`. The report records every raw
run and the median FCP and LCP for each route. These are the only metrics used
for the first optimization.

## Interpretation

These are controlled local laboratory measurements, not real-user field data.
Use the same machine, Chrome installation, Lighthouse version, route set,
throttling method, and run count for before/after comparisons. Runtime metrics
can still vary between runs, so the benchmark preserves all samples and uses
the median rather than presenting a single favorable result.
