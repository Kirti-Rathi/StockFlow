import { AlertTriangle, ChevronRight, Menu, Search } from 'lucide-react'
import type { PageName } from '@/types/inventory'

type Props = {
  page: PageName
  query: string
  alertCount: number
  onQueryChange: (value: string) => void
  onOpenNav: () => void
  onAlertsClick: () => void
}

export function Topbar({ page, query, alertCount, onQueryChange, onOpenNav, onAlertsClick }: Props) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onOpenNav} aria-label="Open navigation"><Menu /></button>
      <div className="breadcrumbs">
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>{page}</strong>
      </div>
      <div className="topbar-right">
        <label className="global-search">
          <Search size={16} />
          <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Search anything..." />
          <kbd>⌘ K</kbd>
        </label>
        <button className="notification" aria-label={`${alertCount} stock alerts`} onClick={onAlertsClick}>
          <AlertTriangle size={18} />
          {alertCount > 0 && <i />}
        </button>
        <div className="date-stamp">
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
        </div>
      </div>
    </header>
  )
}
