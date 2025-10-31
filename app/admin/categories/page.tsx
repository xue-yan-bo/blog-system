import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CategoryForm } from '@/components/CategoryForm'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { blogs: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回管理面板
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">分类管理</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">添加新分类</h2>
            <CategoryForm />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">现有分类</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      /{category.slug} • {category._count.blogs} 篇文章
                    </p>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-gray-500 text-center py-8">暂无分类</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

