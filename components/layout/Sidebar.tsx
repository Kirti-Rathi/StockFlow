import { Boxes, Check, Settings2, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import type { PageName } from '@/types/inventory'

type Props = {
  page: PageName
  open: boolean
  productCount: number
  alertCount: number
  onNavigate: (page: PageName) => void
  onClose: () => void
  onReset: () => void
}

export function Sidebar({ page, open, productCount, alertCount, onNavigate, onClose, onReset }: Props) {
  return (
    <>
      <aside className={`sidebar ${open ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Boxes size={19} /></div>
          <span>stockflow<span className="brand-period">.</span></span>
          <button className="mobile-close" onClick={onClose} aria-label="Close menu"><X /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${page === label ? 'active' : ''}`}
              onClick={() => { onNavigate(label); onClose() }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === 'Products' && <span className="nav-count">{productCount}</span>}
              {label === 'Stock management' && alertCount > 0 && <span className="nav-alert">{alertCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-health">
            <span className="health-dot" />
            <span>Inventory synced</span>
            <span className="health-check"><Check size={12} /></span>
          </div>
          <button className="nav-item about" onClick={onReset}>
            <Settings2 size={17} />
            <span>Reset demo data</span>
          </button>
          <div className="version">STOCKFLOW <span>VERSION 1.0</span></div>
        </div>
      </aside>
      {open && <button className="scrim" aria-label="Close menu" onClick={onClose} />}
    </>
  )
}
