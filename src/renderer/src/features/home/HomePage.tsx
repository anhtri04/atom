import { useState } from 'react'

const menuItems = [
  { label: 'Explorer', icon: '▣' },
  { label: 'Search', icon: '⌕' },
  { label: 'Source Control', icon: '⑂' },
  { label: 'Run', icon: '▷' },
  { label: 'Extensions', icon: '⬚' }
]

const chatMessages = [
  { role: 'assistant', text: 'Hi! I am ready to help with your workspace.' },
  { role: 'user', text: 'Let’s build the next feature.' }
]

function Header({ isChatOpen, onToggleChat }: HeaderProps): JSX.Element {
  return (
    <header className="app-drag-region flex h-12 shrink-0 items-center border-b border-[#2b2b2b] bg-[#181818] text-[13px] text-[#cccccc]">
      <div className="flex h-full w-64 items-center gap-3 px-3">
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Close window"
            className="app-no-drag h-3 w-3 rounded-full bg-[#ff5f57] hover:brightness-110"
            type="button"
            onClick={() => void window.electron.closeWindow()}
          />
          <button
            aria-label="Minimize window"
            className="app-no-drag h-3 w-3 rounded-full bg-[#ffbd2e] hover:brightness-110"
            type="button"
            onClick={() => void window.electron.minimizeWindow()}
          />
          <button
            aria-label="Toggle maximize window"
            className="app-no-drag h-3 w-3 rounded-full bg-[#28c840] hover:brightness-110"
            type="button"
            onClick={() => void window.electron.toggleMaximizeWindow()}
          />
        </div>
        <span className="text-base font-semibold text-[#3daee9]">Atom</span>
      </div>

      <nav aria-label="Application menu" className="flex h-full items-center text-[#bdbdbd]">
        {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((item) => (
          <button
            key={item}
            className="app-no-drag h-full px-3 hover:bg-[#2a2d2e] hover:text-white"
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="mx-6 flex min-w-0 flex-1 justify-center">
        <div className="app-no-drag flex h-7 w-full max-w-xl items-center justify-center rounded-md border border-[#3c3c3c] bg-[#252526] px-4 text-[#9d9d9d] shadow-inner">
          atom — initial workspace
        </div>
      </div>

      <div className="app-no-drag flex h-full items-center gap-2 px-3">
        <button
          aria-pressed={isChatOpen}
          className="rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-1.5 text-[#d4d4d4] transition hover:border-[#007acc] hover:bg-[#2a2d2e]"
          type="button"
          onClick={onToggleChat}
        >
          {isChatOpen ? 'Hide AI' : 'Show AI'}
        </button>
      </div>
    </header>
  )
}

function MenuSidePanel(): JSX.Element {
  return (
    <aside className="flex h-full w-72 shrink-0 border-r border-[#2b2b2b] bg-[#181818] text-[#cccccc]">
      <div className="flex w-12 flex-col items-center border-r border-[#2b2b2b] bg-[#181818] py-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            aria-label={item.label}
            className="mb-2 flex h-10 w-10 items-center justify-center rounded text-xl text-[#858585] hover:bg-[#2a2d2e] hover:text-white first:border-l-2 first:border-[#007acc] first:text-white"
            type="button"
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 items-center px-4 text-[11px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
          Menu
        </div>
        <div className="px-3 py-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-[#2a2d2e]"
              type="button"
            >
              <span className="text-[#858585]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function ChatPanel(): JSX.Element {
  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-[#2b2b2b] bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="flex h-11 items-center justify-between border-b border-[#2b2b2b] px-4">
        <h2 className="text-sm font-semibold">AI Chat</h2>
        <span className="rounded bg-[#007acc]/20 px-2 py-0.5 text-xs text-[#8bd5ff]">online</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {chatMessages.map((message) => (
          <div
            key={`${message.role}-${message.text}`}
            className={message.role === 'assistant' ? 'rounded-lg bg-[#252526] p-3' : 'ml-8 rounded-lg bg-[#0e639c] p-3'}
          >
            <p className="mb-1 text-xs uppercase tracking-wide text-[#9d9d9d]">{message.role}</p>
            <p className="text-sm leading-6">{message.text}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#2b2b2b] p-3">
        <label className="sr-only" htmlFor="chat-input">
          Chat message
        </label>
        <textarea
          id="chat-input"
          className="h-24 w-full resize-none rounded-md border border-[#3c3c3c] bg-[#252526] p-3 text-sm outline-none placeholder:text-[#858585] focus:border-[#007acc]"
          placeholder="Ask AI anything..."
        />
      </div>
    </aside>
  )
}

interface HeaderProps {
  isChatOpen: boolean
  onToggleChat: () => void
}

export function HomePage(): JSX.Element {
  const [isChatOpen, setIsChatOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="flex min-w-0 flex-1 flex-col">
        <Header isChatOpen={isChatOpen} onToggleChat={() => setIsChatOpen((current) => !current)} />
        <div className="flex min-h-0 flex-1">
          <MenuSidePanel />
          <main className="flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
            <div className="h-9 border-b border-[#2b2b2b] bg-[#252526]" />
            <section aria-label="Main workspace" className="min-h-0 flex-1" />
          </main>
          {isChatOpen ? <ChatPanel /> : null}
        </div>
      </div>
    </div>
  )
}
