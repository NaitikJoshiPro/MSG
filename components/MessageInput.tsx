'use client'

import { useRef, useState, useCallback } from 'react'

interface Props {
  onSend: (content: string) => Promise<void>
  onTyping: (isTyping: boolean) => void
}

export function MessageInput({ onSend, onTyping }: Props) {
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)

    // Auto resize
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }

    // Typing indicator
    if (!isTypingRef.current) {
      isTypingRef.current = true
      onTyping(true)
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false
      onTyping(false)
    }, 2000)
  }

  const handleSend = useCallback(async () => {
    const content = value.trim()
    if (!content || sending) return

    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    // Stop typing indicator
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    isTypingRef.current = false
    onTyping(false)

    setSending(true)
    try {
      await onSend(content)
    } catch (e) {
      setValue(content)
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }, [value, sending, onSend, onTyping])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 py-4 border-t border-[#111] flex-shrink-0">
      <div className="flex items-end gap-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl px-4 py-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          rows={1}
          className="flex-1 bg-transparent text-white text-[14px] placeholder-[#444] resize-none focus:outline-none leading-relaxed min-h-[22px] max-h-[160px] overflow-y-auto"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || sending}
          className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 disabled:opacity-20 transition-opacity hover:bg-[#e0e0e0]"
          aria-label="Send"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 10V2M2 6l4-4 4 4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="text-[11px] text-[#2a2a2a] text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
