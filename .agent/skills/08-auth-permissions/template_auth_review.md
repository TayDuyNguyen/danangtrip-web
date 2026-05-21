# Auth & Permissions Review: <Feature Name>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> Route scope: `<route-path>`

---

## 1) Protected Routes
| Route | Middleware Needed | Redirect Behavior | Notes |
|---|---|---|---|
| | | | |

## 2) Role Matrix
| Role | View | Create | Update | Delete | Notes |
|---|---|---|---|---|---|
| guest | | | | | |
| user | | | | | |
| admin | | | | | |

## 2.1) Action Matrix
| Action | Allowed Role(s) | UI Behavior | Backend Expectation | Notes |
|---|---|---|---|---|
| | | | | |

## 3) Guarded UI Actions
| UI Element | Visible To | Why |
|---|---|---|
| | | |

## 3.1) Hidden vs Disabled Decisions
| UI Element | Hidden or Disabled | Reason | Risk |
|---|---|---|---|
| | | | |

## 4) Risks / Assumptions
- [ASSUMPTION] A-01:
- R-01:

## 5) Files / Areas Affected
- `src/middleware.ts`
- `src/store/...`
- `src/features/...`
- `src/components/...`
