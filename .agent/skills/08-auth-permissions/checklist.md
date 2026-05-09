# Checklist: 08-auth-permissions

- [ ] Auth state source of truth: Zustand store.
- [ ] Token sync: Zustand ↔ Cookie (js-cookie).
- [ ] Axios interceptor gắn `Authorization: Bearer <token>` tự động.
- [ ] Route protected trong `src/middleware.ts` (nếu cần).
- [ ] Redirect: unauthorized → `/login?redirect=<current-route>`.
- [ ] Role-based UI: conditional render (KHÔNG chỉ CSS hide).
- [ ] Buttons/menu items gated đúng theo role/permission.
- [ ] Logout flow: clear store + clear cookies + redirect.
- [ ] Token refresh: xử lý expired → refresh → retry (nếu applicable).
- [ ] Không expose tokens trong URL hoặc console.
- [ ] `.env.example` cập nhật nếu thêm auth env vars.
- [ ] Không commit secrets/credentials.
- [ ] `npm run typecheck` pass.
