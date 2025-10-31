import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

// 确保环境变量被设置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db'
}

const prisma = new PrismaClient()

async function main() {
  console.log('开始种子数据...')

  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '技术',
        slug: 'technology',
      },
    }),
    prisma.category.create({
      data: {
        name: '生活',
        slug: 'lifestyle',
      },
    }),
    prisma.category.create({
      data: {
        name: '旅行',
        slug: 'travel',
      },
    }),
  ])

  console.log('创建了 3 个分类')

  // 创建示例博客
  const blog1 = await prisma.blog.create({
    data: {
      title: '欢迎使用博客系统',
      slug: 'welcome-to-blog-system',
      content: `
        <h2>欢迎！</h2>
        <p>这是一个功能完整的博客管理系统。</p>
        <h3>主要功能：</h3>
        <ul>
          <li>✅ 分类浏览和筛选</li>
          <li>✅ 图片上传和展示</li>
          <li>✅ 短视频上传（≤60秒）</li>
          <li>✅ 附件上传和下载</li>
          <li>✅ 完整的后台管理</li>
        </ul>
        <p>开始创建您的第一篇博客吧！</p>
      `,
      excerpt: '探索博客系统的强大功能，开始您的内容创作之旅。',
      published: true,
      categoryId: categories[0].id,
    },
  })

  const blog2 = await prisma.blog.create({
    data: {
      title: '如何使用后台管理',
      slug: 'how-to-use-admin-panel',
      content: `
        <h2>后台管理指南</h2>
        <p>访问 /admin 进入管理面板。</p>
        <h3>创建博客：</h3>
        <ol>
          <li>点击"创建博客"按钮</li>
          <li>填写标题和内容</li>
          <li>选择分类</li>
          <li>上传图片、视频或附件</li>
          <li>选择发布或保存为草稿</li>
        </ol>
      `,
      excerpt: '详细了解如何使用博客管理后台。',
      published: true,
      categoryId: categories[0].id,
    },
  })

  const blog3 = await prisma.blog.create({
    data: {
      title: '生活中的美好瞬间',
      slug: 'beautiful-moments-in-life',
      content: `
        <h2>记录生活</h2>
        <p>用文字和图片记录生活中的美好瞬间。</p>
        <p>这个博客系统支持上传多张图片，让您的故事更加生动。</p>
      `,
      excerpt: '记录和分享生活中的美好时刻。',
      published: true,
      categoryId: categories[1].id,
    },
  })

  console.log('创建了 3 篇示例博客')
  console.log('种子数据完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

