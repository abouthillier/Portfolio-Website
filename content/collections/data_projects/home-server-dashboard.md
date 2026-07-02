---
id: 1ff2a1ed-96f6-4757-90df-8605815e506f
blueprint: data_projects
title: 'Home Server Dashboard'
description: "I built a personal dashboard that polls my homelab every 30 seconds and pulls everything into one view. One Express endpoint fans out parallel health checks across Pi-hole, Docker, Tailscale, and the sites I host — plus request counts I derive from Caddy logs instead of running a separate analytics stack. It's the quickest way to know if something's down before I start digging through containers."
data_source: |-
  - Pi-hole API — DNS queries, blocks, client counts
  - Caddy container logs — per-site request volume over a rolling window
  - HTTP probes — status code and response time for hosted sites
  - tempLogger — current temperature and short-term trend from recent readings
  - Docker API + Tailscale local socket — container and mesh device health
tools_used:
  - react
  - vite
  - node-js
  - express
  - docker
  - caddy
  - tailscale
key_findings:
  - id: dp01traffic
    finding: 'Traffic without an analytics DB'
    description: 'Parses Caddy JSON logs via Docker to count requests per host; no extra database or tracker.'
  - id: dp02aggregate
    finding: 'Single aggregation endpoint'
    description: '/api/status parallelizes ~15 integration checks so the React UI gets one payload on a 30s refresh cycle.'
  - id: dp03links
    finding: 'Context-aware links'
    description: "Deep links resolve to LAN or Tailscale URLs depending on how I'm viewing the dashboard."
methodology: |-
  - Node/Express aggregator with per-service modules in `services/`
  - React SPA (Vite) with hand-built status cards and an infra flow diagram (browser → tunnel → reverse proxy → app)
  - Server-side proxies where APIs shouldn't expose credentials to the browser
  - Docker deployment with `docker.sock` and Tailscale socket mounts for local integrations
updated_by: 7775a028-954d-4a8d-9ab3-e09d457083cb
updated_at: 1782915175
featured_visualization: firefox_ooubds2mab.png
---
