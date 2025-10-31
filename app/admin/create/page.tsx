import { prisma } from '@/lib/prisma'
import { BlogForm } from '@/components/BlogForm'

export default async function CreateBlogPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">创建博客</h1>
        <BlogForm categories={categories} />
      </div>
    </div>
  )
}

