# Screen Analysis: <Screen Name>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> Figma: <link>

---

## 1) Summary
- Màn hình này phục vụ mục đích gì?
- Ai là người dùng chính?
- Thuộc feature/module nào?
- Source inputs nào đã dùng? (Figma, SRS, notes, API docs)

## 2) Design Token Audit
| Token | Figma Value | DESIGN.md Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Primary color | | | | |
| Typography | | | | |
| Spacing | | | | |
| Border radius | | | | |
| Shadow/Blur | | | | |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| | | | |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| | | | |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| | | | |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | | Baseline |
| Tablet (768-1023px) | | |
| Mobile (<768px) | | |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| | | | | | | |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| | | | | | |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| | | | | | |

## 8) Business Rules
- BR-01:
- BR-02:

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| | | | |

## 10) Edge Cases
- EC-01:
- EC-02:

## 11) Assumptions & Open Questions
### Assumptions
- [ASSUMPTION] A-01:

### Open Questions
- Q-01:

## 12) Implementation Checklist
- [ ] Types & API contract
- [ ] Route & layout
- [ ] UI components (list tên)
- [ ] Data integration (list hooks)
- [ ] Interactions (list actions)
- [ ] Auth/permissions (nếu cần)
- [ ] Testing
- [ ] Optimization

## 13) Files / Areas Likely To Change
- `src/app/...`
- `src/features/...`
- `src/components/...`
- `src/services/...`
- `src/messages/...`
