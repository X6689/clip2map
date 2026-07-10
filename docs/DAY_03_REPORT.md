# Clip2Map Day 3 执行报告

日期：2026-07-10

## Day 3 目标

只修复验证闭环：把 `/create` 和 `/feedback` 从 mailto / copy fallback 升级为真实持久化提交，同时保留失败时的 Copy fallback。不增加登录、支付或社交平台 API。

## 实际完成

- `/create` 新增必填 `Video links` textarea
- Map Request 提交顶层字段：`email`、`city`、`videoLinks`、`mapType`、`notes`、`sourcePage`、`createdAt`
- `/feedback` 使用同一提交层，并以 `sourcePage=/feedback` 和结构化 `notes` 保存
- 成功文案严格使用：`Request received. We'll review your links and send a sample map if it fits the test.`
- endpoint 缺失、网络失败或非 2xx 时进入原有 mailto / Copy fallback
- 增加 Supabase REST anon key header 支持和 10 秒 timeout
- 增加 Supabase insert-only RLS schema
- 增加 Node SQLite 本地接收器，数据文件位于 `outputs/day03/clip2map-feedback.sqlite`

## 数据安全

- `supabase/schema.sql` 只向 `anon` / `authenticated` 授予 `INSERT`
- 未授予匿名 `SELECT`、`UPDATE` 或 `DELETE`
- 前端只支持 Supabase anon key，文档明确禁止 service-role key
- 本地临时接收器只有 `POST /submissions`，没有读取接口
- 未增加登录、支付、视频下载、TikTok / Instagram / YouTube API 或抓取

## QA 结果

- 本地桌面 `/create` 提交成功，SQLite 记录 ID 1
- 本地桌面 `/feedback` 提交成功，SQLite 记录 ID 2
- 本地 390×844 的 `/create` 与 `/feedback` 提交成功，`scrollWidth=390`
- 关闭接收器后 `/create` 显示 endpoint error 和 `Copy Request`
- 公开 GitHub Pages 390×844 的 `/create` 提交成功，SQLite 记录 ID 7
- 公开 GitHub Pages 390×844 的 `/feedback` 提交成功，SQLite 记录 ID 8
- 两条公开记录均回读验证了必需 payload 字段
- `npm run lint`：通过
- `npm run build`：通过
- GitHub Pages workflow run `29067802288`：build / deploy 通过

## QA 截图

- `E:\Clip2Map\outputs\day03\create-mobile-success.png`
- `E:\Clip2Map\outputs\day03\feedback-mobile-success.png`
- `E:\Clip2Map\outputs\day03\public-create-mobile-success.png`
- `E:\Clip2Map\outputs\day03\public-feedback-mobile-success.png`

## 部署状态

- 公开站点：https://x6689.github.io/clip2map/
- GitHub 仓库：https://github.com/X6689/clip2map
- GitHub Actions 已读取仓库变量 `NEXT_PUBLIC_FEEDBACK_ENDPOINT`
- 当前公开 QA endpoint 通过临时 HTTPS 隧道连接到 E 盘 SQLite；本轮公开提交已实际成功

## 已知限制

- 当前临时隧道没有 uptime 保证，电脑、SQLite 接收器或 SSH 隧道停止后，公开表单会进入 Copy fallback
- 机器上没有 Supabase 登录或项目凭据，因此没有虚构 Supabase 已上线；正式切换只需执行 `supabase/schema.sql` 并配置 REST URL 与 anon key
- SQLite 使用 Node 内置 `node:sqlite`，当前 Node 24 会显示 ExperimentalWarning，但本轮读写正常

## 下一步

1. 在用户自己的 Supabase Free 项目执行 schema，替换临时 endpoint。
2. 邀请首批目标用户实际提交 5 份链接请求。
3. 只根据真实放弃点修复一个表单问题，不扩功能。
