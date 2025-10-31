# 博客系统 (Blog System)

一个功能完整的现代化博客管理系统，支持分类浏览、多媒体上传（图片、短视频）、附件下载等功能。

## 功能特性

### ✅ 已实现功能

1. **博客前台**
   - 博客列表页面，支持分类筛选
   - Category Tab 分类展示（包括"全部"选项卡）
   - 博客详情页面，展示完整内容
   - 响应式设计，适配各种设备

2. **多媒体支持**
   - ✅ 图片上传和展示（支持多张图片）
   - ✅ 短视频上传（时长限制 ≤ 60 秒）
   - 自动验证视频时长
   - 图片画廊展示
   - 内置视频播放器

3. **附件功能**
   - ✅ 附件上传（支持各种文件类型）
   - ✅ 附件下载
   - 显示文件大小和类型
   - 美观的附件列表展示

4. **后台管理**
   - 博客 CRUD 操作（创建、读取、更新、删除）
   - 分类管理
   - 草稿/发布状态控制
   - 富媒体编辑器
   - 实时文件上传进度

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite (Prisma ORM)
- **图标**: Lucide React
- **表单处理**: React Hook Form + Zod

## 项目架构

```
blog-system/
├── app/
│   ├── api/              # API 路由
│   │   ├── blogs/        # 博客 CRUD API
│   │   ├── categories/   # 分类 API
│   │   └── upload/       # 文件上传 API
│   ├── blog/             # 博客前台页面
│   │   ├── [slug]/       # 博客详情页
│   │   └── page.tsx      # 博客列表页
│   ├── admin/            # 后台管理页面
│   │   ├── create/       # 创建博客
│   │   ├── edit/[id]/    # 编辑博客
│   │   ├── categories/   # 分类管理
│   │   └── page.tsx      # 管理面板
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/           # React 组件
│   ├── BlogForm.tsx      # 博客表单（创建/编辑）
│   ├── BlogList.tsx      # 博客列表
│   ├── CategoryTabs.tsx  # 分类选项卡
│   ├── CategoryForm.tsx  # 分类表单
│   ├── Navigation.tsx    # 导航栏
│   └── DeleteButton.tsx  # 删除按钮
├── lib/
│   ├── prisma.ts         # Prisma Client 实例
│   └── utils.ts          # 工具函数
├── prisma/
│   └── schema.prisma     # 数据库模型
└── public/
    └── uploads/          # 上传文件存储目录
        ├── images/       # 图片
        ├── videos/       # 视频
        └── attachments/  # 附件
```

## 数据库模型

### Category (分类)
- `id`: 唯一标识符
- `name`: 分类名称
- `slug`: URL 友好的标识符
- `createdAt`, `updatedAt`: 时间戳

### Blog (博客)
- `id`: 唯一标识符
- `title`: 标题
- `slug`: URL 友好的标识符
- `content`: 内容（支持 HTML）
- `excerpt`: 摘要
- `coverImage`: 封面图片 URL
- `published`: 发布状态
- `categoryId`: 所属分类
- `createdAt`, `updatedAt`: 时间戳

### Media (媒体)
- `id`: 唯一标识符
- `blogId`: 所属博客
- `type`: 类型（image/video）
- `url`: 文件 URL
- `filename`: 文件名
- `filesize`: 文件大小
- `duration`: 视频时长（秒）
- `createdAt`: 时间戳

### Attachment (附件)
- `id`: 唯一标识符
- `blogId`: 所属博客
- `filename`: 文件名
- `url`: 文件 URL
- `filesize`: 文件大小
- `mimetype`: MIME 类型
- `createdAt`: 时间戳

## 启动方法

### 1. 安装依赖

```bash
npm install
```

### 2. 数据库设置

数据库已配置为 SQLite，无需额外设置。如果数据库文件不存在，运行以下命令：

```bash
npx prisma generate
npx prisma db push
```

### 3. 创建初始分类（可选）

```bash
# 启动开发服务器后，访问 http://localhost:3000/admin/categories
# 创建几个分类，例如：技术、生活、旅行等
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 使用指南

### 创建博客

1. 访问 http://localhost:3000/admin
2. 点击"创建博客"按钮
3. 填写标题、选择分类、输入内容
4. 上传图片、视频（≤60秒）或附件
5. 选择"发布"或保存为草稿
6. 点击"创建"按钮

### 管理分类

1. 访问 http://localhost:3000/admin/categories
2. 输入分类名称（Slug 自动生成）
3. 点击"创建分类"

### 浏览博客

1. 访问 http://localhost:3000/blog
2. 使用 Category Tab 筛选不同分类
3. 点击博客卡片查看详情
4. 在详情页下载附件或观看视频

## 部署到 Vercel

### 1. 准备部署

```bash
# 确保所有依赖已安装
npm install

# 构建测试
npm run build
```

### 2. 配置 Vercel

在 Vercel 项目设置中，添加以下环境变量：

```
DATABASE_URL="file:./dev.db"
```

**注意**: SQLite 不适合 Vercel 等无服务器环境的持久化存储。建议切换到 PostgreSQL：

1. 在 [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) 创建数据库
2. 更新 `prisma/schema.prisma` 中的 `provider` 为 `postgresql`
3. 将 Vercel 提供的 `DATABASE_URL` 添加到环境变量

### 3. 文件上传配置

对于生产环境，建议使用云存储服务（如 AWS S3、Cloudinary 等）替代本地文件存储。

修改 `app/api/upload/route.ts` 以集成云存储服务。

### 4. 部署

```bash
# 使用 Vercel CLI
npm install -g vercel
vercel

# 或者通过 GitHub 集成自动部署
```

## API 端点

### 博客相关
- `POST /api/blogs` - 创建博客
- `PUT /api/blogs/[id]` - 更新博客
- `DELETE /api/blogs/[id]` - 删除博客

### 分类相关
- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建分类

### 文件上传
- `POST /api/upload` - 上传文件（图片、视频、附件）

## 功能演示

### 1. 分类筛选
- 所有博客列表页面都包含 Category Tab
- "全部"选项卡显示所有已发布的博客
- 点击分类选项卡筛选对应分类的博客

### 2. 多媒体上传
- 在创建/编辑博客时，可以上传多张图片
- 支持上传短视频（自动验证时长 ≤ 60 秒）
- 实时显示上传进度

### 3. 附件下载
- 博客详情页显示所有附件
- 显示文件名、大小和类型
- 点击即可下载

## 注意事项

1. **视频时长限制**: 系统会自动检测视频时长，超过 60 秒的视频将被拒绝
2. **文件大小**: 建议限制单个文件大小在 50MB 以内
3. **数据库**: 开发环境使用 SQLite，生产环境建议使用 PostgreSQL
4. **文件存储**: 生产环境建议使用云存储服务

## 未来改进

- [ ] 用户认证和授权
- [ ] 评论系统
- [ ] 搜索功能
- [ ] 标签系统
- [ ] SEO 优化
- [ ] 图片压缩和优化
- [ ] 云存储集成
- [ ] Markdown 编辑器
- [ ] 博客浏览统计

## 作者

此项目为技术评估任务，展示了完整的全栈开发能力，包括：
- Next.js 14 (App Router) 应用开发
- TypeScript 类型安全
- Prisma ORM 数据库操作
- 文件上传和处理
- 响应式 UI 设计
- API 路由开发

## 许可证

MIT
