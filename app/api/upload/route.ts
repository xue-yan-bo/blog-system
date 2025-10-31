import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ message: '没有文件' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 确定上传目录
    let uploadDir = 'public/uploads/'
    if (type === 'image') {
      uploadDir += 'images/'
    } else if (type === 'video') {
      uploadDir += 'videos/'
    } else if (type === 'attachment') {
      uploadDir += 'attachments/'
    }

    // 创建目录（如果不存在）
    const fullPath = path.join(process.cwd(), uploadDir)
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = path.join(fullPath, filename)

    // 保存文件
    await writeFile(filepath, buffer)

    // 返回文件 URL
    const url = `/uploads/${type === 'image' ? 'images' : type === 'video' ? 'videos' : 'attachments'}/${filename}`

    return NextResponse.json({ url, filename: file.name, size: file.size })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

