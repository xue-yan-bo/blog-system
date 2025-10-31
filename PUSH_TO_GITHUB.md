# 推送代码到 GitHub

## 步骤 1: 创建 GitHub 仓库

访问 https://github.com/new 创建新仓库

建议仓库名: `blog-system` 或 `bioarktech-blog-enhancement`

## 步骤 2: 推送代码

在 `blog-system` 目录下执行以下命令：

```bash
# 1. 进入项目目录
cd blog-system

# 2. 提交所有更改
git commit -m "feat: 完整的博客系统实现

功能特性:
- ✅ Blog 前台分类展示（Category Tab 包含'全部'选项）
- ✅ 图片上传和展示
- ✅ 短视频上传（≤60秒，自动时长验证）
- ✅ 附件上传与下载功能
- ✅ 后台管理界面（CRUD 操作）
- ✅ 响应式设计

技术栈:
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM + SQLite
- Tailwind CSS"

# 3. 添加远程仓库（替换成你的 GitHub 仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/blog-system.git

# 4. 推送到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 3: 验证

访问你的 GitHub 仓库链接，应该能看到所有代码已上传。

## 完整的推送命令（复制粘贴）

**替换 `YOUR_USERNAME` 为你的 GitHub 用户名：**

```bash
cd blog-system
git commit -m "feat: 完整的博客系统实现 - 分类筛选、多媒体上传、附件下载"
git remote add origin https://github.com/YOUR_USERNAME/blog-system.git
git branch -M main
git push -u origin main
```

## 如果遇到错误

### 错误 1: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/blog-system.git
```

### 错误 2: "branch 'main' set up to track 'origin/main'"
说明推送成功！

### 错误 3: 需要登录
GitHub 会提示你登录，输入用户名和密码（或 Personal Access Token）

## 推送成功后

GitHub 仓库地址将是:
```
https://github.com/YOUR_USERNAME/blog-system
```

将此地址发送到 fei.li@agentum.me

