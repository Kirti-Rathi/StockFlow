import { Plus } from 'lucide-react'
import { PAGE_DESCRIPTIONS } from '@/lib/constants'
import type { PageName } from '@/types/inventory'

type Props = {
  page: PageName
  onAddProduct: () => void
  onAddCategory: () => void
  onRecordMovement: () => void
}

export function PageHeading({ page, onAddProduct, onAddCategory, onRecordMovement }: Props) {
  const isOverview = page === 'Overview'
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">INVENTORY / {page.toUpperCase()}</div>
        <h1>
          {isOverview ? 'Good morning, team' : page}
          {isOverview && <span className="heading-period">.</span>}
        </h1>
        <p>{PAGE_DESCRIPTIONS[page]}</p>
      </div>
      {page === 'Products' && (
        <button className="primary-button" onClick={onAddProduct}><Plus size={16} /> Add product</button>
      )}
      {page === 'Categories' && (
        <button className="primary-button" onClick={onAddCategory}><Plus size={16} /> Add category</button>
      )}
      {page === 'Stock management' && (
        <button className="primary-button" onClick={onRecordMovement}><Plus size={16} /> Record movement</button>
      )}
    </div>
  )
}
