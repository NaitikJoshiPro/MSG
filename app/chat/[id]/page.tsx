import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ConversationView } from '@/components/ConversationView'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { id } = await params

  // Verify user is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        userId: session.user.id,
        conversationId: id,
      },
    },
  })

  if (!participant) notFound()

  // Get the other participant
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  if (!conversation) notFound()

  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== session.user.id
  )

  if (!otherParticipant) notFound()

  return (
    <ConversationView
      conversationId={id}
      currentUserId={session.user.id}
      otherUser={otherParticipant.user}
    />
  )
}
