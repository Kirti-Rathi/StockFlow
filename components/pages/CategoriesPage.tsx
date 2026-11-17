import { ArrowUpRight, Pencil, Tags, X } from 'lucide-react'
import { currency } from '@/lib/inventory'
import type { Category, Product } from '@/types/inventory'

type Props = {
  categories: Category[]
  products: Product[]
  onViewProducts: (categoryId: string) => void
  onRename: (category: Category) => void
  onDelete: (category: Category, productCount: number) => void
}

export function CategoriesPage({ categories, products, onViewProducts, onRename, onDelete }: Props) {
  const counts = categories.map(c => ({ name: c.name, n: products.filter(p => p.categoryId === c.id).length }))
  const mostPopulated = [...counts].sort((a, b) => b.n - a.n)[0]?.name ?? '—'

  return (
    <>
      <div className="category-summary">
        <div><span>CATEGORIES</span><strong>{categories.length}</strong></div>
        <div><span>PRODUCTS ASSIGNED</span><strong>{products.length}</strong></div>
        <div><span>MOST POPULATED</span><strong>{mostPopulated}</strong></div>
      </div>
      <div className="category-cards">
        {categories.map((c, i) => {
          const items = products.filter(p => p.categoryId === c.id)
          return (
            <article className="category-card" key={c.id}>
              <div className={`category-icon c-${i % 4}`}><Tags /></div>
              <div className="category-id">{c.id}</div>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              <div className="category-stats">
                <div><strong>{items.length}</strong><span>PRODUCTS</span></div>
                <div><strong>{items.reduce((n, p) => n + p.quantity, 0)}</strong><span>UNITS</span></div>
                <div><strong>{currency(items.reduce((n, p) => n + p.quantity * p.price, 0))}</strong><span>VALUE</span></div>
              </div>
              <div className="category-card-foot">
                <button onClick={() => onViewProducts(c.id)}>View products <ArrowUpRight size={14} /></button>
                <button aria-label={`Edit ${c.name}`} onClick={() => onRename(c)}><Pencil size={14} /></button>
                <button aria-label={`Delete ${c.name}`} onClick={() => onDelete(c, items.length)}><X size={15} /></button>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
