# Clip2Map

Clip2Map 是一个 30 天产品验证项目，定位是：**Turn food spots into a shareable map.**

Day 4 提交层以 Supabase 为主通道，将 Map Request 和 Feedback 分别写入独立表；Day 3 endpoint 继续作为备用通道，本地提供兼容 Supabase REST 形状的 SQLite 接收器用于闭环 QA。

- 公开站点：[https://x6689.github.io/clip2map/](https://x6689.github.io/clip2map/)
- GitHub：[https://github.com/X6689/clip2map](https://github.com/X6689/clip2map)

## 当前功能

- 英文 Landing Page、清晰 CTA 和 Tokyo Ramen Map 预览
- `/maps/tokyo-ramen`：8 个 Demo 地点、marker、筛选、卡片定位和 Copy Map Link
- `/create`：完整 Map Request 研究表单与基础校验
- `/feedback`：产品反馈表单
- `/privacy`：与当前 MVP 行为一致的简短隐私说明
- `/create` 会提交 email、city、videoLinks、mapType、notes、sourcePage 和 createdAt
- `/feedback` 直接写入独立的 `feedback` 表
- 前端使用 `NEXT_PUBLIC_SUPABASE_URL` 与公开 anon key 直写 Supabase
- 提交顺序：Supabase → 临时 endpoint → mailto / Copy fallback
- `map_requests` 与 `feedback` 均使用 insert-only RLS
- 本地 SQLite 接收器用于验证真实写入
- 轻量 analytics event 接口，开发环境记录、生产环境静默
- 桌面端与手机端响应式布局

## 技术栈

- Next.js 16、React 19、TypeScript strict mode
- Tailwind CSS 4
- React Leaflet + Leaflet + OpenStreetMap
- Lucide React
- Supabase PostgreSQL（正式持久化 schema）与 Node SQLite（本地 QA）
- ESLint

不需要付费 API Key，也没有登录、支付、视频下载或平台抓取。

## 本地运行

```powershell
cd E:\Clip2Map
npm install
npm run feedback:server
```

另开一个终端：

```powershell
cd E:\Clip2Map
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。本地接收器同时模拟 `/rest/v1/map_requests`、`/rest/v1/feedback` 和备用 `/submissions`，数据保存在 `outputs/day04/clip2map-submissions.sqlite`。

生产检查：

```powershell
npm run lint
npm run test:feedback
npm run build
npm run start
```

## 环境变量

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FEEDBACK_ENDPOINT=
NEXT_PUBLIC_FEEDBACK_API_KEY=
```

所有 `NEXT_PUBLIC_` 值都会进入浏览器。只能使用 Supabase anon key，绝不能使用 service-role key。运行 [supabase/schema.sql](supabase/schema.sql) 后，前端会直接写入 `map_requests` 和 `feedback`；旧 endpoint 仅在 Supabase 失败时使用。

## 页面路由

| 路由 | 用途 |
| --- | --- |
| `/` | Landing Page |
| `/maps/tokyo-ramen` | 可筛选、可分享的 Demo Map |
| `/create` | Map Request 产品研究表单 |
| `/feedback` | 产品反馈表单 |
| `/privacy` | MVP 隐私与数据说明 |

## 目录结构

```text
src/
  app/                      页面路由
  components/               地图、表单、导航、Footer 与事件组件
  data/tokyo-ramen.ts       本地 Demo 地点
  lib/analytics.ts          轻量事件接口
  lib/feedback.ts           endpoint、timeout、mailto 与复制能力
scripts/local-feedback-server.mjs  本地 SQLite 只写接收器
supabase/schema.sql         Supabase 表、RLS 与 insert-only policy
scripts/test-feedback.mjs  Supabase 路由、字段与 fallback 测试
docs/
  DAY_01_REPORT.md
  DAY_02_REPORT.md
  30_DAY_PLAN.md
  DEPLOYMENT.md
outputs/                    本地 QA 产物，不提交到 Git
```

## 当前限制

- Demo 地点不代表实际探店或个人推荐
- OpenStreetMap 图块需要联网
- GitHub Pages 的稳定提交依赖 Supabase URL、anon key 和已执行的 schema
- 没有自动解析社交媒体链接、AI 提取、账号、私有地图或地图编辑器
- analytics 只预留接口，尚未接第三方分析平台

## 部署

部署准备和回滚步骤见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 下一步

Day 3 建议只做真实用户测试：

1. 邀请 5 名目标用户完成首页、Demo Map 和 Map Request 任务。
2. 记录他们最偏好的输入方式和表单放弃点。
3. 根据反馈只修复一个最影响提交率的问题。
