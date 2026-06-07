# System Deploy Audit Review - Web

Date: 2026-06-06
Feature slug: `system-deploy-audit`

## Objective

Find and fix deployment failures across the public Next.js application and its Cloudflare OpenNext output.

## Scope

- Environment and release workflow validation
- Dynamic route metadata and SSR API usage
- Route integrity, lint, TypeScript, production build
- OpenNext bundle generation and Wrangler dry-run

## Key Decisions

- Metadata that only needs a category label now derives it from the slug instead of calling the API.
- Detail routes reuse one API result between metadata and page rendering.
- Deploy commands now fail early when public or API URLs point to localhost.

## Status

Ready for user review. No commit or deployment was performed.
