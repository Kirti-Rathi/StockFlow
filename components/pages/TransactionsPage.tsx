import { Activity, ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react'
import { TransactionTable } from '@/components/tables/TransactionTable'
import type { Transaction } from '@/types/inventory'

type Props = {
  transactions: Transaction[]
  query: string
  onQueryChange: (v: string) => void
}

export function TransactionsPage({ transactions, query, onQueryChange }: Props) {
  const q = query.toLowerCase()
  const rows = transactions.filter(t => t.productName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
  const sum = (type: Transaction['type']) =>
    transactions.filter(t => t.type === type).reduce((n, t) => n + t.quantity, 0)
  const today = transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).length

  return (
    <>
      <div className="stats-grid transaction-stats">
        <div className="stat-card">
          <div className="stat-top"><span>TOTAL TRANSACTIONS</span><Activity size={17} /></div>
          <div className="stat-value">{transactions.length}</div>
          <div className="stat-foot"><span className="stat-note">All recorded movements</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>UNITS RECEIVED</span><ArrowDownLeft size={17} /></div>
          <div className="stat-value">{sum('STOCK_IN')}</div>
          <div className="stat-foot"><span className="stat-note">Across all stock-ins</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>UNITS ISSUED</span><ArrowUpRight size={17} /></div>
          <div className="stat-value">{sum('STOCK_OUT')}</div>
          <div className="stat-foot"><span className="stat-note">Across all stock-outs</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>TODAY</span><Activity size={17} /></div>
          <div className="stat-value">{today}</div>
          <div className="stat-foot"><span className="stat-note">Movements recorded</span></div>
        </div>
      </div>
      <div className="filters">
        <div className="filter-search">
          <Search size={16} />
          <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Search transaction or product" />
        </div>
        <button className="reset-filter" onClick={() => onQueryChange('')}>Reset</button>
      </div>
      <section className="panel data-panel">
        <TransactionTable rows={rows} />
      </section>
    </>
  )
}
