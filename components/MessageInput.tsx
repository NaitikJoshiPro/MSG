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

    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
    }

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    isTypingRef.current = false
    onTyping(false)

    setSending(true)
    try {
      await onSend(content)
    } catch {
      setValue(content)
    } finally {
      setSending(false)
      textareaRef.current?.focus()
    }
  }, [value, sending, onSend, onTyping])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Only auto-send on Enter on non-mobile (physical keyboard)
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth >= 768) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="px-3 pt-2 border-t border-[#111] flex-shrink-0 bg-black"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-end gap-2 bg-[#0d0d0d] border border-[#1c1c1c] rounded-2xl px-3 py-2.5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          rows={1}
          enterKeyHint="send"
          className="flex-1 bg-transparent text-white text-[16px] placeholder-[#3a3a3a] resize-none focus:outline-none leading-[1.5] min-h-[26px] max-h-[140px] overflow-y-auto"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || sending}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 disabled:opacity-20 transition-opacity active:scale-95"
          aria-label="Send"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 10V2M2 6l4-4 4 4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
