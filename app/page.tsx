import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BlogList } from '@/components/BlogList'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    include: {
      category: true,
      media: true,
      attachments: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            欢迎来到博客系统
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            探索最新的文章、资源和见解
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              浏览博客
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              管理后台
            </Link>
          </div>
        </div>

        {/* 最新博客 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">最新文章</h2>
          {blogs.length > 0 ? (
            <>
              <BlogList blogs={blogs} />
              <div className="text-center mt-8">
                <Link
                  href="/blog"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  查看所有文章 →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg mb-4">还没有发布的文章</p>
              <Link
                href="/admin/create"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                创建第一篇文章
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
