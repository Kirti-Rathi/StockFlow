import { ArrowDownLeft, ArrowDownRight, ArrowLeftRight, ArrowUpRight, Search } from 'lucide-react'
import { STOCK_IN_REASONS, STOCK_OUT_REASONS } from '@/lib/constants'
import { ProductTable, type ProductActions } from '@/components/tables/ProductTable'
import type { Category, Product, StockForm, StockType } from '@/types/inventory'

type Props = ProductActions & {
  allProducts: Product[]
  products: Product[]
  categories: Category[]
  query: string
  stockType: StockType
  stockForm: StockForm
  onQueryChange: (v: string) => void
  onStockTypeChange: (t: StockType) => void
  onStockFormChange: (f: StockForm) => void
  onSubmit: () => void
}

export function StockPage({
  allProducts, products, categories, query, stockType, stockForm,
  onQueryChange, onStockTypeChange, onStockFormChange, onSubmit, ...actions
}: Props) {
  const isIn = stockType === 'STOCK_IN'
  const selected = allProducts.find(p => p.id === stockForm.productId)
  const newStock = (selected?.quantity ?? 0) + (Number(stockForm.quantity) || 0) * (isIn ? 1 : -1)

  return (
    <>
      <div className="stock-tabs">
        <button className={isIn ? 'selected' : ''} onClick={() => onStockTypeChange('STOCK_IN')}><ArrowDownLeft size={16} /> Stock in</button>
        <button className={!isIn ? 'selected' : ''} onClick={() => onStockTypeChange('STOCK_OUT')}><ArrowUpRight size={16} /> Stock out</button>
        <span className="stock-tabs-note">ALL MOVEMENTS ARE RECORDED IN TRANSACTION HISTORY</span>
      </div>

      <section className="panel stock-form-panel" id="stock-form">
        <div className="panel-heading">
          <div>
            <div className="panel-kicker">{isIn ? 'RECEIVING' : 'ISSUING'}</div>
            <h2>{isIn ? 'Receive inventory' : 'Issue inventory'}</h2>
          </div>
          <span className="form-icon"><ArrowLeftRight /></span>
        </div>
        <div className="form-grid">
          <label>PRODUCT
            <select value={stockForm.productId} onChange={e => onStockFormChange({ ...stockForm, productId: e.target.value })}>
              <option value="">Select a product</option>
              {allProducts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.quantity} available)</option>)}
            </select>
          </label>
          <label>QUANTITY
            <input type="number" min="1" value={stockForm.quantity} onChange={e => onStockFormChange({ ...stockForm, quantity: e.target.value })} placeholder="0" />
          </label>
          <label>REASON
            <select value={stockForm.reason} onChange={e => onStockFormChange({ ...stockForm, reason: e.target.value })}>
              {(isIn ? STOCK_IN_REASONS : STOCK_OUT_REASONS).map(r => <option key={r}>{r}</option>)}
            </select>
          </label>
        </div>
        <div className="stock-preview">
          {selected && (
            <>
              <span>Current stock <strong>{selected.quantity} units</strong></span>
              <ArrowDownRight className="preview-arrow" size={17} />
              <span>New stock <strong>{newStock} units</strong></span>
            </>
          )}
          <button className="primary-button" onClick={onSubmit}>
            {isIn ? 'Record stock in' : 'Record stock out'} <ArrowUpRight size={15} />
          </button>
        </div>
      </section>

      <div className="section-label">
        <div><div className="panel-kicker">CURRENT LEVELS</div><h2>Inventory summary</h2></div>
        <div className="filter-search compact-search">
          <Search size={15} />
          <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Search products" />
        </div>
      </div>
      <section className="panel data-panel">
        <ProductTable rows={products} categories={categories} {...actions} />
      </section>
    </>
  )
}
