'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
}

interface Media {
  id: string
  type: string
  url: string
  filename: string
  filesize: number
  duration?: number | null
}

interface Attachment {
  id: string
  filename: string
  url: string
  filesize: number
  mimetype: string
}

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  categoryId: string
  media: Media[]
  attachments: Attachment[]
}

interface BlogFormProps {
  categories: Category[]
  blog?: Blog
}

export function BlogForm({ categories, blog }: BlogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    coverImage: blog?.coverImage || '',
    categoryId: blog?.categoryId || categories[0]?.id || '',
    published: blog?.published || false,
  })

  const [media, setMedia] = useState<Media[]>(blog?.media || [])
  const [attachments, setAttachments] = useState<Attachment[]>(blog?.attachments || [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        continue
      }

      setUploadingFiles((prev) => [...prev, file.name])

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'image')

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          setMedia((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'image',
              url: data.url,
              filename: file.name,
              filesize: file.size,
            },
          ])
        } else {
          alert('上传失败')
        }
      } catch (error) {
        alert('上传失败')
      } finally {
        setUploadingFiles((prev) => prev.filter((n) => n !== file.name))
      }
    }

    e.target.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('video/')) {
        alert('请选择视频文件')
        continue
      }

      // 检查视频时长
      const video = document.createElement('video')
      video.preload = 'metadata'

      const checkDuration = new Promise<number>((resolve, reject) => {
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          resolve(Math.round(video.duration))
        }
        video.onerror = () => reject(new Error('无法加载视频'))
        video.src = URL.createObjectURL(file)
      })

      try {
        const duration = await checkDuration

        if (duration > 60) {
          alert('视频时长不能超过 60 秒')
          continue
        }

        setUploadingFiles((prev) => [...prev, file.name])

        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'video')
        formData.append('duration', duration.toString())

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          setMedia((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: 'video',
              url: data.url,
              filename: file.name,
              filesize: file.size,
              duration,
            },
          ])
        } else {
          alert('上传失败')
        }
      } catch (error) {
        alert('上传失败')
      } finally {
        setUploadingFiles((prev) => prev.filter((n) => n !== file.name))
      }
    }

    e.target.value = ''
  }

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      setUploadingFiles((prev) => [...prev, file.name])

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'attachment')

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          setAttachments((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              filename: file.name,
              url: data.url,
              filesize: file.size,
              mimetype: file.type,
            },
          ])
        } else {
          alert('上传失败')
        }
      } catch (error) {
        alert('上传失败')
      } finally {
        setUploadingFiles((prev) => prev.filter((n) => n !== file.name))
      }
    }

    e.target.value = ''
  }

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id))
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = blog ? `/api/blogs/${blog.id}` : '/api/blogs'
      const method = blog ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          media,
          attachments,
        }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.message || '提交失败')
      }
    } catch (error) {
      alert('提交失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标题 *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug *
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          分类 *
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          摘要
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          封面图片 URL
        </label>
        <input
          type="url"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          内容 *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* 图片上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <ImageIcon className="w-4 h-4 inline mr-2" />
          图片
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {media.filter((m) => m.type === 'image').length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {media
              .filter((m) => m.type === 'image')
              .map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{image.filename}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 视频上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Video className="w-4 h-4 inline mr-2" />
          短视频（≤ 60 秒）
        </label>
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {media.filter((m) => m.type === 'video').length > 0 && (
          <div className="mt-4 space-y-2">
            {media
              .filter((m) => m.type === 'video')
              .map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{video.filename}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(video.filesize)} • {video.duration}秒
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedia(video.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 附件上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          附件
        </label>
        <input
          type="file"
          multiple
          onChange={handleAttachmentUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{attachment.filename}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.filesize)} • {attachment.mimetype}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadingFiles.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            正在上传: {uploadingFiles.join(', ')}...
          </p>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          name="published"
          id="published"
          checked={formData.published}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="ml-2 text-sm text-gray-700">
          发布
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || uploadingFiles.length > 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : blog ? '更新' : '创建'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </form>
  )
}

