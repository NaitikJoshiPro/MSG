'use client'

import { ConversationSidebar } from './ConversationSidebar'

export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <ConversationSidebar />
      <div className="flex-1 flex flex-col min-w-0 border-l border-[#111]">
        {children}
      </div>
    </div>
  )
}
