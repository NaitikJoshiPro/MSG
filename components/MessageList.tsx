'use client'

import { useEffect, useRef } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import { TypingIndicator } from './TypingIndicator'

interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender: { id: string; name: string }
}

interface Props {
  messages: Message[]
  currentUserId: string
  isTyping: boolean
  otherUserName: string
}

function formatMessageTime(date: Date): string {
  if (isToday(date)) return format(date, 'h:mm a')
  if (isYesterday(date)) return `Yesterday ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, h:mm a')
}

export function MessageList({ messages, currentUserId, isTyping, otherUserName }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#333] text-sm">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
      {messages.map((msg, i) => {
        const isMine = msg.senderId === currentUserId
        const date = new Date(msg.createdAt)
        const prevMsg = messages[i - 1]
        const showTime =
          !prevMsg ||
          new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() >
            5 * 60 * 1000

        return (
          <div key={msg.id}>
            {showTime && (
              <div className="flex justify-center my-4">
                <span className="text-[11px] text-[#444]">{formatMessageTime(date)}</span>
              </div>
            )}
            <div
              className={`flex message-enter ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words ${
                  isMine
                    ? 'bg-white text-black rounded-br-sm'
                    : 'bg-[#141414] text-white rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        )
      })}

      {isTyping && (
        <div className="flex justify-start message-enter">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
