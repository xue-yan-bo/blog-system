import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, categoryId, published, media, attachments } = body

    // 删除旧的媒体和附件
    await prisma.media.deleteMany({
      where: { blogId: id },
    })
    await prisma.attachment.deleteMany({
      where: { blogId: id },
    })

    // 更新博客
    const blog = await prisma.blog.update({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.blog.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

