import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogForm } from '@/components/BlogForm'

export default async function EditBlogPage({
  params,
}: {
  params: { id: string }
}) {
  const blog = await prisma.blog.findUnique({
    where: { id: params.id },
    include: {
      media: true,
      attachments: true,
    },
  })

  if (!blog) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">编辑博客</h1>
        <BlogForm categories={categories} blog={blog} />
      </div>
    </div>
  )
}

