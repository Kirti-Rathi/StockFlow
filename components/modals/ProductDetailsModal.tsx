import { X } from 'lucide-react'
import { currency, getCategoryName, stockState } from '@/lib/inventory'
import type { Category, Product } from '@/types/inventory'

type Props = {
  product: Product
  categories: Category[]
  onClose: () => void
  onManageStock: () => void
  onEdit: () => void
}

export function ProductDetailsModal({ product, categories, onClose, onManageStock, onEdit }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal details-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div>
            <div className="panel-kicker">PRODUCT DETAILS · {product.id}</div>
            <h2>{product.name}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <p className="details-description">{product.description || 'No description provided.'}</p>
        <div className="details-grid">
          <div><span>CATEGORY</span><strong>{getCategoryName(categories, product.categoryId)}</strong></div>
          <div><span>UNIT PRICE</span><strong>{currency(product.price)}</strong></div>
          <div><span>AVAILABLE</span><strong>{product.quantity} units</strong></div>
          <div><span>MINIMUM STOCK</span><strong>{product.minStock} units</strong></div>
          <div><span>INVENTORY VALUE</span><strong>{currency(product.quantity * product.price)}</strong></div>
          <div><span>STATUS</span><strong>{stockState(product)}</strong></div>
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onManageStock}>Manage stock</button>
          <button className="primary-button" onClick={onEdit}>Edit product</button>
        </div>
      </div>
    </div>
  )
}
