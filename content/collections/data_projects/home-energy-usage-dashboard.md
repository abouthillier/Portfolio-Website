---
id: 087d7891-d0f2-4276-b755-bedafe22e6b8
blueprint: data_projects
title: 'Home Energy Usage Dashboard'
description: 'I got tired of digging through utility PDFs, so I built a pipeline that turns my electric and gas bills into something I can actually chart. Drop invoices in a folder, run a scan, and months of kWh, therms, and cost land in SQLite — enriched with local weather from Open-Meteo. The React view (a route in my home dashboard) shows trends, effective rates, seasonal anomalies, and year-over-year comparisons.'
data_source: |-
  - Mansfield Municipal Electric PDF invoices
  - Eversource Gas PDF invoices
  - Historical monthly usage CSV (backfill before PDFs existed)
  - Open-Meteo Archive API — avg temp, heating/cooling degree days per billing month
tools_used:
  - rust
  - axum
  - sqlite
  - sqlx
  - react
  - open-meteo
key_findings:
  - id: en01parsers
    finding: 'Bill layout parsers'
    description: 'Custom regex extractors tuned to my actual electric and gas invoice formats, with SHA-256 dedup so re-scanning a folder is safe.'
  - id: en02merge
    finding: 'CSV + PDF merge logic'
    description: 'Spreadsheet backfill defers to parsed bills when real invoices arrive; stale historical rows get trimmed automatically.'
  - id: en03insights
    finding: 'Insight without a BI layer'
    description: 'Client-side seasonal anomaly detection (±25% vs same-month history), peak records, and YTD year-over-year — all on aggregated monthly data from the Rust API.'
methodology: |-
  - Rust sidecar (`energy-dashboard`) — Axum REST API, SQLx + SQLite, `pdftotext` for PDF extraction
  - Idempotent upserts on `(provider, billing_period_start, billing_period_end)`
  - Weather enrichment pass batches Open-Meteo archive requests per billing month
  - Express in the main dashboard proxies `/api/energy/*` so the browser never talks to the sidecar directly
updated_by: 7775a028-954d-4a8d-9ab3-e09d457083cb
updated_at: 1782915186
featured_visualization: firefox_j1jonj2tvv.png
---
