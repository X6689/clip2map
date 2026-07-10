# Clip2Map Day 4 Endpoint 报告

日期：2026-07-10

## 目标

将 Clip2Map 表单从临时 HTTPS 隧道迁移到稳定 Supabase 主通道，同时保留 Day 3 endpoint 和 Copy fallback，不增加登录、支付或页面结构改动。

## 已完成代码

- `supabase/schema.sql` 改为独立的 `map_requests` 与 `feedback` 表
- 两表均启用并强制 RLS
- 撤销 `public`、`anon`、`authenticated` 的全部默认权限后，仅重新授予 `INSERT`
- 前端读取 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `/create` 直接 POST `/rest/v1/map_requests`
- `/feedback` 直接 POST `/rest/v1/feedback`
- 提交顺序为 Supabase → `NEXT_PUBLIC_FEEDBACK_ENDPOINT` → Copy fallback
- 保留 10 秒 timeout、重复提交保护和现有成功/失败 UI
- 未增加登录、支付，也未改核心页面结构

## 字段映射

`map_requests` 保存 email、city、video_links、map_type、notes、source_page、created_at、map_title、place_count、current_storage、preferred_input。

`feedback` 保存 email、goal、confusing、feature、notes、source_page、created_at。

## 本地 QA

- 本地使用 Supabase REST 兼容路径写入 SQLite，而不是走备用 endpoint
- 390×844 `/create` 提交成功，`scrollWidth=390`
- 390×844 `/feedback` 提交成功，`scrollWidth=390`
- `map_requests` 与 `feedback` 各回读 1 条正确记录
- `endpoint_fallback` 记录数为 0，确认主通道优先
- 本地 mock 对 `GET`、`PATCH`、`DELETE` 均返回 405
- 截图：`outputs/day04/create-local-mobile-success.png`
- 截图：`outputs/day04/feedback-local-mobile-success.png`

## 自动验证

- `npm run test:feedback`：5/5 通过
- 覆盖 map_requests 路由、feedback 路由、snake_case 字段映射、endpoint fallback、Copy fallback
- `npm run lint`：通过
- `npm run build`：通过

## Supabase 与公开部署状态

Supabase 项目已配置，远程 schema、RLS 权限、本地表单和 GitHub Pages 表单均已完成验证。完整证据见 `docs/DAY_04_SUPABASE_VERIFY_REPORT.md`。

公开兼容性 QA 已完成：

- GitHub Pages workflow run `29071352192`：通过
- 390×844 `/create` 通过备用 endpoint 提交成功，`scrollWidth=390`
- 390×844 `/feedback` 通过备用 endpoint 提交成功，`scrollWidth=390`
- 两条记录已从 SQLite `endpoint_fallback` 表回读
- 截图：`outputs/day04/create-public-fallback-mobile-success.png`
- 截图：`outputs/day04/feedback-public-fallback-mobile-success.png`

## 最终状态

- Supabase 已成为本地和公开站的主提交通道
- Day 3 endpoint 继续保留为备用通道
- 未使用 service-role key
