import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Verify user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        userId: session.user.id,
        conversationId: id,
      },
    },
  })
  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    include: {
      sender: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  return NextResponse.json(messages)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Verify user is participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        userId: session.user.id,
        conversationId: id,
      },
    },
  })
  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const content = body.content?.trim()
  if (!content) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

  const message = await prisma.message.create({
    data: {
      content,
      senderId: session.user.id,
      conversationId: id,
    },
    include: {
      sender: { select: { id: true, name: true } },
    },
  })

  // Update conversation updatedAt
  await prisma.conversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  })

  // Trigger Pusher event
  await pusherServer.trigger(`conversation-${id}`, 'new-message', message)

  return NextResponse.json(message)
}
