import { X } from 'lucide-react'
import type { Category, ProductForm } from '@/types/inventory'

type Props = {
  mode: 'add' | 'edit'
  form: ProductForm
  categories: Category[]
  onChange: (form: ProductForm) => void
  onClose: () => void
  onSubmit: () => void
}

export function ProductFormModal({ mode, form, categories, onChange, onClose, onSubmit }: Props) {
  const isAdd = mode === 'add'
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}>
        <div className="modal-heading">
          <div>
            <div className="panel-kicker">PRODUCT CATALOG</div>
            <h2 id="modal-title">{isAdd ? 'Add a product' : 'Edit product'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X /></button>
        </div>
        <div className="modal-fields">
          <label>PRODUCT NAME
            <input value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} placeholder="e.g. Wireless mouse" autoFocus />
          </label>
          <label>CATEGORY
            <select value={form.categoryId} onChange={e => onChange({ ...form, categoryId: e.target.value })}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>DESCRIPTION
            <input value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} placeholder="Product description" />
          </label>
          <div className="form-grid">
            <label>UNIT PRICE (₹)
              <input type="number" min="0" value={form.price} onChange={e => onChange({ ...form, price: e.target.value })} placeholder="0" />
            </label>
            {isAdd && (
              <label>INITIAL QUANTITY
                <input type="number" min="0" value={form.quantity} onChange={e => onChange({ ...form, quantity: e.target.value })} placeholder="0" />
              </label>
            )}
            <label>MINIMUM STOCK
              <input type="number" min="0" value={form.minStock} onChange={e => onChange({ ...form, minStock: e.target.value })} placeholder="0" />
            </label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={onSubmit}>{isAdd ? 'Add product' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  )
}
