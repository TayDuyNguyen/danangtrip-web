# Checklist: 10-optimization-deploy

## Performance
- [ ] `React.memo` cho expensive components (nếu cần).
- [ ] `dynamic(() => import(...))` cho modals/heavy components.
- [ ] `next/image` cho tất cả images.
- [ ] Images above-the-fold có `priority`.
- [ ] Không có unnecessary console.log.
- [ ] Bundle size hợp lý — không import thừa.

## SEO
- [ ] Metadata set ở route level (title, description, OG).
- [ ] 1 `<h1>` per page, heading hierarchy đúng.
- [ ] Semantic HTML: `<main>`, `<nav>`, `<section>`, etc.

## Accessibility
- [ ] Interactive elements có aria-labels.
- [ ] Keyboard navigation: Tab order logic.
- [ ] Focus states visible.
- [ ] Color contrast ≥ WCAG AA.
- [ ] Images có alt text.

## Build
- [ ] `npm run lint` pass.
- [ ] `npm run typecheck` pass.
- [ ] `npm run check:routes` pass.
- [ ] `npm run build` pass (no errors).
- [ ] `.env` đúng cho target environment.

## Deploy
- [ ] Deploy thành công lên target platform.
- [ ] URL accessible.

## Smoke Test
- [ ] Page loads correctly.
- [ ] Critical user flows work (CRUD, search, auth).
- [ ] API connections work.
- [ ] i18n locale switch works.
- [ ] No console errors.
- [ ] Mobile responsive OK.
- [ ] Lighthouse Performance > 90.
