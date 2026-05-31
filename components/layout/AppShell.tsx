import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type AppShellProps = {
  title: string
  children: React.ReactNode
  rightPanel?: React.ReactNode
}

export function AppShell({ title, children, rightPanel }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-salt">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar title={title} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          {rightPanel && (
            <aside className="w-[320px] shrink-0 bg-white border-l border-pine/10 overflow-y-auto">
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
