import { prisma } from '@/lib/prisma'
import { BlogList } from '@/components/BlogList'
import { CategoryTabs } from '@/components/CategoryTabs'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const selectedCategory = searchParams.category

  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
      ...(selectedCategory && selectedCategory !== 'all'
        ? { category: { slug: selectedCategory } }
        : {}),
    },
    include: {
      category: true,
      media: true,
      attachments: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">博客</h1>
          <p className="text-gray-600">探索我们最新的文章和资源</p>
        </div>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
        />

        <BlogList blogs={blogs} />
      </div>
    </div>
  )
}

