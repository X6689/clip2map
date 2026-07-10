# Clip2Map

Clip2Map 是一个 30 天产品验证项目，定位是：**Turn food spots into a shareable map.**

Day 3 版本已经打通真实表单提交：Map Request 和 Feedback 可写入配置的 Supabase REST endpoint；本地也提供 SQLite 接收器用于闭环 QA。所有公开页面使用英文，示例地点均明确标注为 Demo 数据。

- 公开站点：[https://x6689.github.io/clip2map/](https://x6689.github.io/clip2map/)
- GitHub：[https://github.com/X6689/clip2map](https://github.com/X6689/clip2map)

## 当前功能

- 英文 Landing Page、清晰 CTA 和 Tokyo Ramen Map 预览
- `/maps/tokyo-ramen`：8 个 Demo 地点、marker、筛选、卡片定位和 Copy Map Link
- `/create`：完整 Map Request 研究表单与基础校验
- `/feedback`：产品反馈表单
- `/privacy`：与当前 MVP 行为一致的简短隐私说明
- `/create` 会提交 email、city、videoLinks、mapType、notes、sourcePage 和 createdAt
- `/feedback` 使用相同的只写提交层
- 可配置 Supabase REST endpoint 与公开 anon key
- endpoint 缺失或失败时提供 mailto 与 Copy fallback，不误报上传成功
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

不需要付费 API Key，也没有登录、支付、数据库、视频下载或平台抓取。

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

打开 [http://localhost:3000](http://localhost:3000)。本地 `.env.local` 可将 endpoint 指向 `http://127.0.0.1:8787/submissions`，数据保存在 `outputs/day03/clip2map-feedback.sqlite`。

生产检查：

```powershell
npm run lint
npm run build
npm run start
```

## 环境变量

```text
NEXT_PUBLIC_FEEDBACK_ENDPOINT=
NEXT_PUBLIC_FEEDBACK_API_KEY=
```

两项都会进入浏览器，只能使用 Supabase anon key，绝不能使用 service-role key。运行 [supabase/schema.sql](supabase/schema.sql) 后，将 endpoint 设为 `/rest/v1/clip2map_submissions`。

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
- GitHub Pages 的真实提交依赖已配置且在线的 endpoint
- 没有自动解析社交媒体链接、AI 提取、账号、私有地图或地图编辑器
- analytics 只预留接口，尚未接第三方分析平台

## 部署

部署准备和回滚步骤见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 下一步

Day 3 建议只做真实用户测试：

1. 邀请 5 名目标用户完成首页、Demo Map 和 Map Request 任务。
2. 记录他们最偏好的输入方式和表单放弃点。
3. 根据反馈只修复一个最影响提交率的问题。
