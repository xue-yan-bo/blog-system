import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  createdAt: Date
  category: {
    name: string
    slug: string
  }
  media: Array<{
    type: string
    url: string
  }>
}

interface BlogListProps {
  blogs: Blog[]
}

export function BlogList({ blogs }: BlogListProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">暂无博客文章</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.slug}`}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {blog.coverImage && (
            <div className="relative h-48 w-full bg-gray-200">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {!blog.coverImage && blog.media.length > 0 && blog.media[0].type === 'image' && (
            <div className="relative h-48 w-full bg-gray-200">
              <Image
                src={blog.media[0].url}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {!blog.coverImage && blog.media.length === 0 && (
            <div className="h-48 w-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {blog.category.name}
              </span>
              <span className="text-xs text-gray-500">{formatDate(blog.createdAt)}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {blog.title}
            </h2>
            {blog.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

