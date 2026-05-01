'use client'

import { useParams } from 'next/navigation'
import { ConversationSidebar } from './ConversationSidebar'

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const inConversation = !!params?.id

  return (
    <div className="flex bg-black overflow-hidden" style={{ height: '100dvh' }}>
      {/* Sidebar: full-screen on mobile unless inside a conversation */}
      <div
        className={[
          'flex-shrink-0 flex flex-col h-full',
          'w-full md:w-[260px]',
          inConversation ? 'hidden md:flex' : 'flex',
        ].join(' ')}
      >
        <ConversationSidebar />
      </div>

      {/* Chat panel: full-screen on mobile when in a conversation */}
      <div
        className={[
          'flex-1 flex flex-col min-w-0 h-full md:border-l border-[#111]',
          !inConversation ? 'hidden md:flex' : 'flex',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
