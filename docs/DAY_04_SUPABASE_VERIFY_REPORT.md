# Clip2Map Day 4 Supabase 验证报告

日期：2026-07-10

## 最终结论

Clip2Map 已从临时 HTTPS 隧道主通道迁移到稳定 Supabase 提交。本地与 GitHub Pages 的 `/create`、`/feedback` 均直接写入 Supabase 并收到 `201`；Day 3 endpoint 未被调用，仍作为备用通道保留。

## 环境配置

- 本地 `.env.local` 已配置 `NEXT_PUBLIC_SUPABASE_URL`
- 本地 `.env.local` 已配置 publishable anon key
- GitHub Actions Variable：`NEXT_PUBLIC_SUPABASE_URL`
- GitHub Actions Secret：`NEXT_PUBLIC_SUPABASE_ANON_KEY`
- GitHub Actions Variable：`NEXT_PUBLIC_FEEDBACK_ENDPOINT` 继续保留
- 未配置、提交或使用 service-role key
- `.env.local` 由 `.gitignore` 排除，没有进入 Git

Supabase 项目：`https://chuasatnimliftbniljn.supabase.co`

## Schema 与 RLS

已执行 `supabase/schema.sql`，包含：

- `map_requests` 表
- `feedback` 表
- 两表启用并强制 RLS
- 撤销 `public`、`anon`、`authenticated` 的默认权限
- 仅向 `anon`、`authenticated` 重新授予 `INSERT`
- 没有匿名 `SELECT`、`UPDATE`、`DELETE` policy 或 grant

## 匿名 REST 权限验证

使用与前端相同的 publishable anon key 直接调用 Supabase REST：

| 操作 | map_requests | feedback |
| --- | ---: | ---: |
| INSERT | 201 | 201 |
| SELECT | 401 | 401 |
| UPDATE | 401 | 401 |
| DELETE | 401 | 401 |

测试记录邮箱：`day4.rest.1783667548539@example.com`。

## 本地表单验证

视口：390×844。

- `/create` POST `/rest/v1/map_requests`：201
- `/feedback` POST `/rest/v1/feedback`：201
- 两页 `scrollWidth=390`
- 成功状态文案正常显示
- SQLite `endpoint_fallback` 测试前后均为 2，确认未调用备用 endpoint

测试邮箱：

- `day4.map.local.supabase@example.com`
- `day4.feedback.local.supabase@example.com`

截图：

- `outputs/day04/create-local-supabase-mobile-success.png`
- `outputs/day04/feedback-local-supabase-mobile-success.png`

## GitHub Pages 验证

公开站：https://x6689.github.io/clip2map/

部署 workflow run：`29076127448`，build 与 deploy 均成功。

视口：390×844。

- 公开 `/create` POST `/rest/v1/map_requests`：201
- 公开 `/feedback` POST `/rest/v1/feedback`：201
- 两页 `scrollWidth=390`
- 两页成功状态文案正常显示
- SQLite `endpoint_fallback` 仍为 2，确认公开站未调用临时 endpoint

测试邮箱：

- `day4.map.public.supabase@example.com`
- `day4.feedback.public.supabase@example.com`

截图：

- `outputs/day04/create-public-supabase-mobile-success.png`
- `outputs/day04/feedback-public-supabase-mobile-success.png`

## 代码验证

- `npm run test:feedback`：5/5 通过
- `npm run lint`：通过
- `npm run build`：通过
- Git 工作区未包含 `.env.local` 或 anon key 变更

## 产品边界

- 未增加登录
- 未增加支付
- 未改核心页面结构
- 未接 TikTok、Instagram 或 YouTube API
- 临时 endpoint 仅在 Supabase 提交失败时使用
- Supabase 与临时 endpoint 都失败时继续显示 Copy fallback
