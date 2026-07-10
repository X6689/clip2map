# Clip2Map 部署说明

## 当前公开部署

- GitHub 仓库：[https://github.com/X6689/clip2map](https://github.com/X6689/clip2map)
- GitHub Pages：[https://x6689.github.io/clip2map/](https://x6689.github.io/clip2map/)
- 自动部署：`.github/workflows/deploy-pages.yml`

当前生产站点使用 GitHub Pages。Actions 环境中 `next.config.ts` 会启用静态导出和 `/clip2map` base path，本地开发与 `next start` 不受影响。

## 推荐平台

当前使用 GitHub Pages 免费部署。表单持久化推荐 Supabase Free，前端只使用公开 anon key 和 insert-only RLS policy。

## 推送到 GitHub

首次推送：

```powershell
cd E:\Clip2Map
git init -b main
git add .
git commit -m "Complete Clip2Map Day 2 validation MVP"
gh repo create clip2map --public --source . --remote origin --push
```

后续更新：

```powershell
git add .
git commit -m "Describe the change"
git push
```

## Vercel 部署

Vercel 当前未登录，以下步骤需要用户自行完成授权，仅作为可选迁移方案。

无需全局安装 CLI：

```powershell
cd E:\Clip2Map
npx vercel
```

首次部署按提示选择当前 GitHub 账户、创建新项目，并保留以下设置：

- Framework Preset：Next.js
- Install Command：`npm install` 或 `npm ci`
- Build Command：`npm run build`
- Output Directory：留空，使用 Next.js 默认输出
- Root Directory：项目根目录

确认 Preview 正常后再发布 Production：

```powershell
npx vercel --prod
```

也可以在 Vercel Dashboard 选择 `Import Git Repository`，导入 GitHub 仓库并使用相同设置。

## 环境变量

必需变量：

```text
NEXT_PUBLIC_FEEDBACK_ENDPOINT=
NEXT_PUBLIC_FEEDBACK_API_KEY=
```

在 Supabase SQL Editor 执行 `supabase/schema.sql`，endpoint 使用 `https://PROJECT.supabase.co/rest/v1/clip2map_submissions`，API key 使用 anon key。两项都会进入浏览器，绝不能配置 service-role key。RLS 只授予匿名 insert，不授予 select。留空或请求失败时显示 Copy fallback。

## 自定义域名

1. 在 Vercel 项目中打开 Settings → Domains。
2. 添加已拥有的域名，不要在此流程中购买新域名。
3. 按平台提示在域名服务商添加 A、CNAME 或 nameserver 记录。
4. 等待 DNS 生效并确认 HTTPS 自动签发。
5. 将反馈 endpoint 的 CORS 来源同步加入新域名。

## 部署失败排查

1. 本地运行 `npm ci`、`npm run lint`、`npm run build`。
2. 确认 Node.js 使用平台支持的稳定版本，建议 Node 20 或 22。
3. 检查环境变量名和值，确认使用 anon key 而不是 service-role key。
4. 检查 OpenStreetMap 图块网络请求和浏览器控制台 CORS 错误。
5. Leaflet 使用自定义 `divIcon`，不依赖本地默认 marker 图片路径。
6. 表单端点失败时应显示 fallback，而不是空白或假成功。

## 回滚

- Vercel Dashboard：Deployments → 选择已验证版本 → Promote to Production。
- Git：对问题提交执行 `git revert <commit>`，然后 `git push` 触发新部署。
- 不使用 `git reset --hard` 覆盖已推送历史。

## 发布前检查

- `.env.local`、`.next`、`node_modules` 和 `outputs` 未提交
- `/`、`/create`、`/feedback`、`/privacy`、`/maps/tokyo-ramen` 返回 200
- 8 个 marker、OpenStreetMap attribution、筛选和复制链接正常
- 成功提交后在数据库回读记录；失败时明确显示 fallback
