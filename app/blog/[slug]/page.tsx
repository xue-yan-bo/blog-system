import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, formatFileSize } from '@/lib/utils'
import { Download, FileText, Video, Image as ImageIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      media: {
        orderBy: { createdAt: 'asc' },
      },
      attachments: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!blog) {
    notFound()
  }

  const images = blog.media.filter((m) => m.type === 'image')
  const videos = blog.media.filter((m) => m.type === 'video')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 返回按钮 */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← 返回博客列表
        </Link>

        {/* 博客头部 */}
        <article className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-4">
            <Link
              href={`/blog?category=${blog.category.slug}`}
              className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100"
            >
              {blog.category.name}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex items-center text-gray-500 text-sm mb-6">
            <span>{formatDate(blog.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>更新于 {formatDate(blog.updatedAt)}</span>
          </div>

          {blog.coverImage && (
            <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic border-l-4 border-blue-500 pl-4">
              {blog.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* 图片画廊 */}
        {images.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              图片
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative h-48 rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={image.url}
                    alt={image.filename}
                    fill
                    className="object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 视频 */}
        {videos.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="w-6 h-6" />
              视频
            </h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden bg-black">
                  <video
                    controls
                    className="w-full"
                    preload="metadata"
                  >
                    <source src={video.url} type="video/mp4" />
                    您的浏览器不支持视频播放
                  </video>
                  <div className="p-2 bg-gray-800 text-white text-sm">
                    {video.filename}
                    {video.duration && ` (${video.duration}秒)`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 附件下载 */}
        {blog.attachments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              附件下载
            </h2>
            <div className="space-y-3">
              {blog.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  download={attachment.filename}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">
                        {attachment.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(attachment.filesize)} • {attachment.mimetype}
                      </p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

