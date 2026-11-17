import { MoreHorizontal, Package, X } from 'lucide-react'
import { currency, getCategoryName, statusClass, stockState } from '@/lib/inventory'
import type { Category, Product } from '@/types/inventory'

export type ProductActions = {
  onView: (p: Product) => void
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
}

type Props = ProductActions & {
  rows: Product[]
  categories: Category[]
}

export function ProductTable({ rows, categories, onView, onEdit, onDelete }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>PRODUCT</th><th>CATEGORY</th><th>UNIT PRICE</th><th>AVAILABLE</th><th>MIN. STOCK</th><th>STATUS</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(p => {
            const state = stockState(p)
            return (
              <tr key={p.id}>
                <td>
                  <button className="product-name" onClick={() => onView(p)}>{p.name}<small>{p.id}</small></button>
                </td>
                <td>{getCategoryName(categories, p.categoryId)}</td>
                <td>{currency(p.price)}</td>
                <td className="numeric">{p.quantity} <span className="unit-label">units</span></td>
                <td className="numeric">{p.minStock}</td>
                <td><span className={`status ${statusClass(state)}`}><i />{state}</span></td>
                <td>
                  <div className="row-actions">
                    <button aria-label="Edit product" onClick={() => onEdit(p)}><MoreHorizontal size={18} /></button>
                    <button aria-label="Delete product" onClick={() => onDelete(p)}><X size={16} /></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!rows.length && (
        <div className="empty-state">
          <Package />
          <strong>No products found</strong>
          <span>Try adjusting your search or filters.</span>
        </div>
      )}
    </div>
  )
}
