import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { STOCK_FILTERS } from '@/lib/constants'
import { currency } from '@/lib/inventory'
import { ProductTable, type ProductActions } from '@/components/tables/ProductTable'
import type { Category, Product, StockFilter } from '@/types/inventory'

type Props = ProductActions & {
  products: Product[]
  categories: Category[]
  query: string
  filter: StockFilter
  categoryFilter: string
  onQueryChange: (v: string) => void
  onFilterChange: (v: StockFilter) => void
  onCategoryFilterChange: (v: string) => void
  onReset: () => void
}

export function ProductsPage({
  products, categories, query, filter, categoryFilter,
  onQueryChange, onFilterChange, onCategoryFilterChange, onReset, ...actions
}: Props) {
  return (
    <>
      <div className="summary-line">
        <span><strong>{products.length}</strong> products shown</span>
        <span>Inventory value <strong>{currency(products.reduce((n, p) => n + p.price * p.quantity, 0))}</strong></span>
      </div>
      <div className="filters">
        <div className="filter-search">
          <Search size={16} />
          <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Search name or ID" />
        </div>
        <label className="select-filter">
          <SlidersHorizontal size={15} />
          <select value={filter} onChange={e => onFilterChange(e.target.value as StockFilter)}>
            {STOCK_FILTERS.map(f => <option key={f}>{f}</option>)}
          </select>
          <ChevronDown size={14} />
        </label>
        <label className="select-filter">
          <select value={categoryFilter} onChange={e => onCategoryFilterChange(e.target.value)}>
            <option value="All categories">All categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={14} />
        </label>
        <button className="reset-filter" onClick={onReset}>Reset</button>
      </div>
      <section className="panel data-panel">
        <ProductTable rows={products} categories={categories} {...actions} />
      </section>
    </>
  )
}
