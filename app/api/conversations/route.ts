import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId: session.user.id },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return NextResponse.json(conversations)
}
