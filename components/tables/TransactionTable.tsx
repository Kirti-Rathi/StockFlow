import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Transaction } from '@/types/inventory'

export function TransactionTable({ rows }: { rows: Transaction[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TRANSACTION</th><th>PRODUCT</th><th>TYPE</th><th>QUANTITY</th><th>STOCK CHANGE</th><th>REASON</th><th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(t => {
            const isIn = t.type === 'STOCK_IN'
            return (
              <tr key={t.id}>
                <td className="mono">{t.id}</td>
                <td>{t.productName}<small className="subline">{t.productId}</small></td>
                <td>
                  <span className={`transaction-type ${isIn ? 'in' : 'out'}`}>
                    {isIn ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />} {isIn ? 'Stock in' : 'Stock out'}
                  </span>
                </td>
                <td className="numeric">{t.quantity}</td>
                <td className="mono">{t.previousStock} <span className="muted">→</span> {t.updatedStock}</td>
                <td>{t.reason}</td>
                <td>{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!rows.length && <div className="empty-state">No transactions yet.</div>}
    </div>
  )
}
