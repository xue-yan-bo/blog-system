# Vercel 生产环境部署指南

## ✅ 已完成的配置

- [x] 代码已推送到 GitHub
- [x] 已修复 Next.js 15 类型错误
- [x] 已更新 Prisma 使用 PostgreSQL

## 🚀 部署步骤

### 1. 创建 Vercel Postgres 数据库

在 Vercel Dashboard 中：

1. 进入你的项目：https://vercel.com/dashboard
2. 点击 `blog-system` 项目
3. 点击顶部 **"Storage"** 标签
4. 点击 **"Create Database"**
5. 选择 **"Postgres"**
6. 数据库名称：`blog-system-db`（或其他名称）
7. 区域：选择 `Hong Kong` 或 `Singapore`
8. 点击 **"Create"**
9. 创建后，点击 **"Connect Project"**，选择 `blog-system`

✅ Vercel 会自动设置环境变量：
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 2. 初始化数据库

数据库连接后，在项目 Settings → Functions 中运行：

或者在本地通过 Vercel CLI：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 拉取环境变量
vercel env pull

# 推送数据库 schema
npx prisma db push

# 填充种子数据
npm run db:seed
```

### 3. 重新部署

环境变量设置后，Vercel 会自动重新部署。
或者在 Deployments 标签点击 **"Redeploy"**。

## 🎉 完成！

部署成功后，你的博客系统将在：
```
https://blog-system-xxx.vercel.app
```

## ⚠️ 文件上传功能

当前项目使用本地文件存储，在 Vercel 上不会持久化。

**如需文件上传功能，需要配置云存储：**
- Vercel Blob Storage
- AWS S3
- Cloudinary

查看 `DEPLOYMENT.md` 了解详情。

## 📝 环境变量说明

Vercel 自动设置的变量：
- `POSTGRES_PRISMA_URL` - Prisma 连接池 URL
- `POSTGRES_URL_NON_POOLING` - 直连 URL（用于迁移）

## 🔧 常见问题

### 问题：部署后数据库为空
**解决**：运行种子数据脚本（见步骤2）

### 问题：Prisma Client 未生成
**解决**：已配置 `postinstall` 脚本，Vercel 会自动生成

### 问题：构建失败
**解决**：确保数据库已连接并设置环境变量

## 📚 相关文档

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

