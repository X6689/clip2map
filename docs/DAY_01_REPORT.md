# Clip2Map Day 1 执行报告

日期：2026-07-10

## 今天完成了什么

- 在 `E:\Clip2Map` 创建 Next.js + TypeScript 项目骨架
- 完成英文 Landing Page
- 完成 `/maps/tokyo-ramen` 公开示例地图
- 新增 8 个本地 Demo 地点及完整字段
- 使用 React Leaflet + OpenStreetMap 显示 8 个 marker
- 完成分类筛选、卡片定位和 Copy Map Link
- 完成 `/create` 前端意向表单及提交反馈
- 完成桌面与 390px 手机视口 QA

## 已可用功能

- 首页、示例地图和创建表单均可打开
- 地图可缩放，marker 可点击并显示地点信息
- All、Shoyu、Tonkotsu、Miso、Tsukemen 筛选可用
- 地点卡片可驱动地图定位
- 复制链接成功时显示 `Link copied`
- 剪贴板权限受限时展示可选中的完整链接
- 手机端地图与地点列表可正常阅读，无横向滚动

## 本次未做

- 自动解析 TikTok、Instagram 或 YouTube 链接
- 视频下载、评论抓取或平台 API 接入
- AI 地点提取
- 登录、数据库、私有地图和付费
- 复杂地图编辑器

## 问题与处理

1. `create-next-app` 不接受带大写字母的 npm 包名。使用 E 盘小写临时目录初始化后安全移动到指定目录，并将包名设为 `clip2map`。
2. Leaflet 依赖浏览器对象，与服务端渲染冲突。地图组件使用 Client Component，并通过 `next/dynamic` 的 `ssr: false` 延迟到浏览器加载。
3. 无头浏览器可能限制剪贴板权限。增加 DOM 复制回退和可手动选择链接的兼容界面。
4. `npm audit --omit=dev` 报告 Next.js 内置 PostCSS 的 2 个 moderate 告警。自动修复会将 Next.js 破坏性降级到 9.3.3，因此 Day 1 未执行 `--force`；后续等待稳定版上游修复并复测。

## 验证结果

- `npm run lint`：通过
- `npm run build`：通过
- 静态路由：`/`、`/create`、`/maps/tokyo-ramen`
- HTTP 页面检查：三个路由均返回 200
- 手机视口：390px；`scrollWidth` 与视口宽度均为 390px
- 浏览器交互：筛选、地点卡片、marker、地图缩放、复制链接均已检查

## 本地访问地址

- 首页：[http://127.0.0.1:3000](http://127.0.0.1:3000)
- Demo Map：[http://127.0.0.1:3000/maps/tokyo-ramen](http://127.0.0.1:3000/maps/tokyo-ramen)
- Create：[http://127.0.0.1:3000/create](http://127.0.0.1:3000/create)

## 截图

- `E:\Clip2Map\outputs\screenshots\home-desktop.png`
- `E:\Clip2Map\outputs\screenshots\tokyo-ramen-desktop.png`
- `E:\Clip2Map\outputs\screenshots\tokyo-ramen-mobile.png`

## Day 2 建议

1. 完成 5 名目标用户的可用性访谈。
2. 验证用户最想粘贴的是地点名称、视频链接还是现有清单。
3. 依据访谈结果确定下一步唯一核心输入流程。
