'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoryTabsProps {
  categories: Category[]
  selectedCategory?: string
}

export function CategoryTabs({ categories, selectedCategory }: CategoryTabsProps) {
  const searchParams = useSearchParams()
  const currentCategory = selectedCategory || 'all'

  return (
    <div className="mb-8 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        <Link
          href="/blog?category=all"
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${
              currentCategory === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          全部
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                currentCategory === category.slug
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

