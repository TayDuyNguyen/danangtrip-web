# System Deploy Audit - Web

Date: 2026-06-06
Feature slug: `system-deploy-audit`

## Verdict

READY WITH RISKS

## Validation

- `npm run prepush:check`: passed
- `npm run build:cloudflare`: passed
- `wrangler deploy --dry-run`: passed, upload gzip approximately 1.89 MB
- Production environment preflight: passed with production-like URLs and correctly rejected localhost URLs

## Fixes

- Removed unnecessary API calls from category metadata routes.
- Deduplicated detail API calls shared by metadata and page rendering with React request cache.
- Added production URL validation before Cloudflare deployment.
- Changed release CI to build and upload the real `.open-next` artifact.

## Required Production Variables

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `API_BASE_URL` where required by the hosting environment

## Residual Risks

- Next.js reports the middleware convention as deprecated.
- The Edge middleware runtime remains experimental.
- Live production smoke testing was not performed because this audit did not deploy.
