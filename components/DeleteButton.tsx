'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DeleteButton({ blogId }: { blogId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇博客吗？此操作不可撤销。')) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      alert('删除失败')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )
}

