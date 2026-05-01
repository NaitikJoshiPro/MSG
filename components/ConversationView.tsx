'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { pusherClient } from '@/lib/pusher-client'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

interface Message {
  id: string
  content: string
  createdAt: string
  read: boolean
  senderId: string
  sender: { id: string; name: string }
}

interface Props {
  conversationId: string
  currentUserId: string
  otherUser: { id: string; name: string; email: string }
}

export function ConversationView({ conversationId, currentUserId, otherUser }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}/messages`)
      .then((r) => r.json())
      .then(setMessages)
      .catch(console.error)
  }, [conversationId])

  useEffect(() => {
    const channel = pusherClient.subscribe(`conversation-${conversationId}`)

    channel.bind('new-message', (msg: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    channel.bind('typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setIsTyping(data.isTyping)
        if (data.isTyping) {
          if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
          typingTimerRef.current = setTimeout(() => setIsTyping(false), 3000)
        }
      }
    })

    return () => {
      pusherClient.unsubscribe(`conversation-${conversationId}`)
    }
  }, [conversationId, currentUserId])

  const sendMessage = useCallback(
    async (content: string) => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error('Failed to send')
    },
    [conversationId]
  )

  const sendTyping = useCallback(
    async (isTyping: boolean) => {
      await fetch(`/api/conversations/${conversationId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTyping }),
      })
    },
    [conversationId]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#111] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center">
            <span className="text-[12px] font-medium text-[#888]">
              {otherUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-[14px] font-medium text-white">{otherUser.name}</span>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isTyping={isTyping}
        otherUserName={otherUser.name}
      />

      {/* Input */}
      <MessageInput onSend={sendMessage} onTyping={sendTyping} />
    </div>
  )
}
