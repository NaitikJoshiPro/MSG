import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher-server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

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
  await pusherServer.trigger(`conversation-${id}`, 'typing', {
    userId: session.user.id,
    name: session.user.name,
    isTyping: body.isTyping,
  })

  return NextResponse.json({ ok: true })
}
