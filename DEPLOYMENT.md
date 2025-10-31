# 部署指南

## 本地运行

### 1. 安装依赖
```bash
npm install
```

### 2. 生成数据库和种子数据
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## 提交到 GitHub

所有文件已准备好提交。运行以下命令：

```bash
git commit -m "feat: 完整的博客系统实现

- 博客列表页面，支持分类筛选（Category Tab）
- 博客详情页面，展示多媒体和附件
- 后台管理界面（CRUD 操作）
- 图片上传功能
- 短视频上传功能（≤60秒，自动验证）
- 附件上传和下载功能
- 响应式设计
- SQLite 数据库
- Next.js 14 (App Router) + TypeScript
- Prisma ORM
- Tailwind CSS"

# 创建新的 GitHub 仓库后，推送代码
git remote add origin <你的 GitHub 仓库 URL>
git push -u origin master
```

## 部署到 Vercel

### 方法 1: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel
```

### 方法 2: 通过 Vercel Dashboard

1. 访问 https://vercel.com
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目
5. 点击 "Deploy"

### 重要提示：生产环境配置

⚠️ SQLite 不适合 Vercel 等无服务器环境。对于生产部署，建议：

#### 1. 使用 Vercel Postgres

在 Vercel 项目中：
1. 进入 "Storage" 标签
2. 创建 Postgres 数据库
3. 复制 `DATABASE_URL` 到环境变量

修改 `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

运行迁移：
```bash
npx prisma db push
npx prisma generate
```

#### 2. 使用云存储服务

对于文件上传，建议使用：
- AWS S3
- Cloudinary
- Vercel Blob

修改 `app/api/upload/route.ts` 以集成云存储。

## 测试部署

部署后，测试以下功能：
- ✅ 浏览博客列表
- ✅ 使用 Category Tab 筛选
- ✅ 查看博客详情
- ✅ 访问管理后台 `/admin`
- ✅ 创建新博客
- ✅ 上传图片、视频、附件
- ✅ 编辑和删除博客

## 环境变量

如果使用 PostgreSQL，在 Vercel 中设置：

```
DATABASE_URL="postgresql://..."
```

## 故障排除

### 问题：数据库连接失败
- 确保环境变量 `DATABASE_URL` 已设置
- 确保已运行 `npx prisma generate`

### 问题：文件上传失败
- 检查 `public/uploads` 目录权限
- 生产环境需要使用云存储服务

### 问题：构建失败
- 运行 `npm run build` 本地测试
- 检查 TypeScript 错误
- 确保所有依赖已安装

## 性能优化建议

1. **图片优化**: 使用 Next.js Image 组件
2. **缓存**: 启用 ISR (Incremental Static Regeneration)
3. **CDN**: 使用 Vercel CDN 自动优化
4. **数据库索引**: 在常用查询字段添加索引
5. **代码分割**: Next.js 自动处理

## 后续改进

- [ ] 用户认证（NextAuth.js）
- [ ] 图片压缩和优化
- [ ] Markdown 编辑器
- [ ] 评论系统
- [ ] 搜索功能
- [ ] SEO 优化
- [ ] 分析和统计

祝您部署顺利！🚀

