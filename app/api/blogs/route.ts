import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, categoryId, published, media, attachments } = body

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        categoryId,
        published,
        media: {
          create: media.map((m: any) => ({
            type: m.type,
            url: m.url,
            filename: m.filename,
            filesize: m.filesize,
            duration: m.duration,
          })),
        },
        attachments: {
          create: attachments.map((a: any) => ({
            filename: a.filename,
            url: a.url,
            filesize: a.filesize,
            mimetype: a.mimetype,
          })),
        },
      },
    })

    return NextResponse.json(blog)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

