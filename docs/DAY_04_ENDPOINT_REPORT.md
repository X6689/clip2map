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

当前机器没有 Supabase access token、Project URL 或 anon key；Supabase CLI 返回 `Access token not provided`。本机也没有 Docker / psql，无法自行启动完整 Supabase 或执行远程 schema。

因此当前状态为：

- 代码、schema、本地与 390px QA 已完成
- 公开站点仍通过 Day 3 endpoint 收集，不会因本次改动中断
- 远程 Supabase schema 执行、RLS 的真实 SELECT/PATCH/DELETE 拒绝验证、GitHub Pages Supabase 提交仍待项目配置

## 完成远程切换所需输入

1. 在 Supabase SQL Editor 执行 `E:\Clip2Map\supabase\schema.sql`。
2. 提供公开 Project URL 与 anon key。
3. 配置 GitHub variable / secret 后重新部署，并完成桌面、390px 和数据库回读测试。

anon key 可以公开；不要提供或配置 service-role key、数据库密码或其他管理凭据。
