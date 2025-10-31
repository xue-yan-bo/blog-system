import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, categoryId, published, media, attachments } = body

    // 删除旧的媒体和附件
    await prisma.media.deleteMany({
      where: { blogId: params.id },
    })
    await prisma.attachment.deleteMany({
      where: { blogId: params.id },
    })

    // 更新博客
    const blog = await prisma.blog.update({
      where: { id: params.id },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

