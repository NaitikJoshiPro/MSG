'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  id: string
  updatedAt: string
  participants: Array<{
    user: { id: string; name: string; email: string }
  }>
  messages: Array<{
    id: string
    content: string
    createdAt: string
    sender: { id: string; name: string }
  }>
}

export function ConversationSidebar() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const activeId = params?.id as string | undefined

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then(setConversations)
      .catch(console.error)
  }, [])

  function getOtherUser(conv: Conversation) {
    return conv.participants.find((p) => p.user.id !== session?.user?.id)?.user
  }

  function getInitial(name: string) {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="w-[260px] flex-shrink-0 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <span className="text-base font-semibold tracking-tight text-white">MSG</span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-[#555] hover:text-[#888] text-xs transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {conversations.map((conv) => {
          const other = getOtherUser(conv)
          if (!other) return null
          const lastMsg = conv.messages[0]
          const isActive = activeId === conv.id

          return (
            <button
              key={conv.id}
              onClick={() => router.push(`/chat/${conv.id}`)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-[#111]'
                  : 'hover:bg-[#0a0a0a]'
              }`}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] font-medium text-[#888]">
                  {getInitial(other.name)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium text-white truncate">
                    {other.name}
                  </span>
                  {lastMsg && (
                    <span className="text-[11px] text-[#444] flex-shrink-0">
                      {formatDistanceToNow(new Date(lastMsg.createdAt), {
                        addSuffix: false,
                      })
                        .replace('about ', '')
                        .replace(' minutes', 'm')
                        .replace(' minute', 'm')
                        .replace(' hours', 'h')
                        .replace(' hour', 'h')
                        .replace(' days', 'd')
                        .replace(' day', 'd')}
                    </span>
                  )}
                </div>
                {lastMsg && (
                  <p className="text-[12px] text-[#555] truncate mt-0.5">
                    {lastMsg.sender.id === session?.user?.id ? 'You: ' : ''}
                    {lastMsg.content}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#111]">
        <p className="text-[12px] text-[#444] truncate">{session?.user?.name}</p>
        <p className="text-[11px] text-[#333] truncate">{session?.user?.email}</p>
      </div>
    </div>
  )
}
