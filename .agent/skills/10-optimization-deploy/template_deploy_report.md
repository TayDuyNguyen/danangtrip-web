# Deploy Report: <Feature Name>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> Environment: `<dev/staging/prod>`

---

## 1) Quality Gates
| Check | Status | Notes |
|---|---|---|
| lint | | |
| typecheck | | |
| check:routes | | |
| build | | |
| prepush:check | | |

## 1.1) Build Notes
- Build command nào đã chạy?
- Có warning đáng chú ý không?
- Có follow-up nào về môi trường/bundle không?

## 2) Cloudflare Build / Deploy Status
| Step | Status | Notes |
|---|---|---|
| build:cloudflare | | |
| preview:cloudflare | | |
| deploy:cloudflare | | |

## 3) Smoke Test
| Scenario | Status | Notes |
|---|---|---|
| page load | | |
| critical flow | | |
| locale switch | | |
| auth redirect | | |
| browser console | | |

## 3.1) Additional Scenarios
| Scenario | Status | Notes |
|---|---|---|
| empty state | | |
| error state | | |
| mobile responsive | | |

## 4) Deploy Readiness
- Ready / Not Ready:
- Blocking issues:

## 5) Evidence / References
- Test report:
- Review report:
- Related artifacts:
