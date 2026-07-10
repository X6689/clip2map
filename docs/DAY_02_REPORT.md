# Clip2Map Day 2 执行报告

日期：2026-07-10

## Day 2 目标

把 Day 1 本地 MVP 变成可以公开分享、收集基础反馈并开始真实用户测试的产品，同时不引入账号、数据库、AI API 或平台抓取。

## 实际完成内容

- 将 `/create` 升级为完整 Map Request 产品研究页
- 新增 `/feedback` 和 `/privacy`
- 增加首页、导航和 Demo Map 的 Request / Feedback CTA
- 增加可配置 endpoint、10 秒 timeout、loading、success、error 和 fallback 状态
- 增加统一 analytics event 接口，生产环境不输出调试日志
- 修复清除地图选择后未回到 Tokyo 总览的问题
- 完成 Git、GitHub、GitHub Pages、双视口和公开 URL QA

## 新增页面

- `/feedback`：目标、困惑、最有用功能和可选 email
- `/privacy`：Demo、表单、数据和 analytics 的实际行为说明

## 表单提交策略

- 配置 `NEXT_PUBLIC_FEEDBACK_ENDPOINT` 时，浏览器使用 `POST` JSON 提交
- endpoint 请求 10 秒超时，禁止重复提交，并区分 success 与 error
- 未配置 endpoint 时不上传，明确显示“未上传”
- fallback 提供无收件人的 mailto 草稿和 Copy Request / Copy Feedback
- analytics 只记录 delivery mode，不记录表单个人内容

## Analytics event 层

已定义：`landing_viewed`、`demo_map_opened`、`create_map_clicked`、`map_link_copied`、`category_filter_used`、`place_card_selected`、`map_request_started`、`map_request_submitted`、`feedback_submitted`。

## Git 与部署状态

- Git：已初始化，`main` 已推送
- GitHub：[https://github.com/X6689/clip2map](https://github.com/X6689/clip2map)
- GitHub Pages：[https://x6689.github.io/clip2map/](https://x6689.github.io/clip2map/)
- GitHub Pages workflow：build 和 deploy 均成功
- Vercel：未部署；CLI 无现有凭据，登录流程需要用户授权且本机字符编码导致 CLI 登录中断
- 实际方案：使用已登录的 GitHub 免费 Pages 部署，没有创建付费资源

## QA 结果

- 本地和公开的 `/`、`/create`、`/feedback`、`/privacy`、`/maps/tokyo-ramen` 均返回 200
- 空 Map Request 被必填校验拦截并聚焦 `mapTitle`
- 完整 Map Request 和 Feedback 在无 endpoint 时进入明确 fallback
- Copy Request、Copy Feedback、Copy Map Link 均显示成功反馈
- 地图公开环境显示 8 个自定义 `divIcon` marker，不依赖本地图标路径
- OpenStreetMap attribution 保留
- All / Shoyu 等筛选、地点卡片定位和恢复 Tokyo 总览正常
- 390px 下 Create 和 Demo Map 的 `scrollWidth` 均为 390px
- 未发现 hydration overlay、NaN、Infinity 或服务端错误日志
- Chrome 自动化已执行；Windows 环境无法直接运行 Safari，代码使用标准 fetch、mailto、clipboard fallback 和 Leaflet 兼容路径

## 验证结果

- `npm run lint`：通过
- `npm run build`：通过
- GitHub Actions 静态导出：通过
- 本地静态导出包含 5 个目标页面 HTML
- 自动业务测试：未新增测试框架；表单与地图使用可重复浏览器步骤验证

## 截图路径

- `E:\Clip2Map\outputs\screenshots\day02\home-desktop.png`
- `E:\Clip2Map\outputs\screenshots\day02\create-desktop.png`
- `E:\Clip2Map\outputs\screenshots\day02\create-mobile.png`
- `E:\Clip2Map\outputs\screenshots\day02\feedback-desktop.png`
- `E:\Clip2Map\outputs\screenshots\day02\tokyo-ramen-desktop.png`
- `E:\Clip2Map\outputs\screenshots\day02\tokyo-ramen-mobile.png`

## 已知限制

- 未配置真实 feedback endpoint，当前公开站点使用 mailto / copy fallback
- Demo 地点不是个人实地评价
- OpenStreetMap 图块依赖外部网络
- 未接第三方 analytics 平台

## Day 3 建议

1. 邀请 5 名目标用户完成 Demo Map 与 Map Request 任务。
2. 记录首选输入方式、理解偏差和放弃点。
3. 只修复一个最影响请求完成率的问题。
