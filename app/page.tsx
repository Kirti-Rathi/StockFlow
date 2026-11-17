'use client'

import { useMemo, useState } from 'react'
import { useInventory } from '@/hooks/useInventory'
import { useToast } from '@/hooks/useToast'
import { getStockStats, stockState } from '@/lib/inventory'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { PageHeading } from '@/components/layout/PageHeading'
import { Toast } from '@/components/ui/Toast'
import { ProductFormModal } from '@/components/modals/ProductFormModal'
import { ProductDetailsModal } from '@/components/modals/ProductDetailsModal'
import { OverviewPage } from '@/components/pages/OverviewPage'
import { ProductsPage } from '@/components/pages/ProductsPage'
import { CategoriesPage } from '@/components/pages/CategoriesPage'
import { StockPage } from '@/components/pages/StockPage'
import { TransactionsPage } from '@/components/pages/TransactionsPage'
import type { PageName, Product, ProductForm, StockFilter, StockForm, StockType } from '@/types/inventory'

const EMPTY_FORM: ProductForm = { name: '', categoryId: 'C001', description: '', price: '', quantity: '', minStock: '' }
const defaultReason = (t: StockType) => (t === 'STOCK_IN' ? 'Purchase' : 'Sale')

export default function Page() {
  const { toast, notify } = useToast()
  const inventory = useInventory(notify)
  const { data } = inventory

  const [page, setPage] = useState<PageName>('Overview')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StockFilter>('All stock')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [modal, setModal] = useState<'' | 'add' | 'edit' | 'details'>('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [stockType, setStockType] = useState<StockType>('STOCK_IN')
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [stockForm, setStockForm] = useState<StockForm>({ productId: '', quantity: '', reason: 'Purchase' })

  const { low, out, totalUnits, inventoryValue } = getStockStats(data.products)
  const alertCount = low.length + out.length

  const products = useMemo(() => {
    const q = query.toLowerCase()
    return data.products.filter(
      p =>
        (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
        (categoryFilter === 'All categories' || p.categoryId === categoryFilter) &&
        (filter === 'All stock' || stockState(p) === filter)
    )
  }, [data.products, query, categoryFilter, filter])

  const navigate = (next: PageName, nextFilter?: StockFilter) => {
    setPage(next)
    if (nextFilter) setFilter(nextFilter)
  }

  const closeModal = () => setModal('')

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, categoryId: data.categories[0]?.id ?? '' })
    setModal('add')
  }

  const openEdit = (p: Product) => {
    setSelected(p)
    setForm({
      name: p.name,
      categoryId: p.categoryId,
      description: p.description,
      price: String(p.price),
      quantity: String(p.quantity),
      minStock: String(p.minStock),
    })
    setModal('edit')
  }

  const openDetails = (p: Product) => {
    setSelected(p)
    setModal('details')
  }

  const submitProduct = () => {
    const ok = modal === 'add' ? inventory.addProduct(form) : selected ? inventory.updateProduct(selected.id, form) : false
    if (!ok) return
    closeModal()
    if (modal === 'add') setForm(EMPTY_FORM)
  }

  const changeStockType = (t: StockType) => {
    setStockType(t)
    setStockForm(f => ({ ...f, reason: defaultReason(t) }))
  }

  const submitStock = () => {
    if (inventory.recordStock(stockType, stockForm)) {
      setStockForm({ productId: '', quantity: '', reason: defaultReason(stockType) })
    }
  }

  const promptAddCategory = () => {
    const name = prompt('Category name')
    if (name) inventory.addCategory(name)
  }

  const productActions = { onView: openDetails, onEdit: openEdit, onDelete: inventory.deleteProduct }

  return (
    <main className="app-shell">
      <Sidebar
        page={page}
        open={mobileNav}
        productCount={data.products.length}
        alertCount={alertCount}
        onNavigate={setPage}
        onClose={() => setMobileNav(false)}
        onReset={inventory.resetDemo}
      />
      <section className="main-area">
        <Topbar
          page={page}
          query={query}
          alertCount={alertCount}
          onQueryChange={setQuery}
          onOpenNav={() => setMobileNav(true)}
          onAlertsClick={() => navigate('Products', 'Low stock')}
        />
        <div className="content">
          <PageHeading
            page={page}
            onAddProduct={openAdd}
            onAddCategory={promptAddCategory}
            onRecordMovement={() => document.getElementById('stock-form')?.scrollIntoView({ behavior: 'smooth' })}
          />

          {page === 'Dashboard' && (
            <OverviewPage
              data={data}
              low={low}
              out={out}
              totalUnits={totalUnits}
              inventoryValue={inventoryValue}
              onNavigate={navigate}
              {...productActions}
            />
          )}

          {page === 'Products' && (
            <ProductsPage
              products={products}
              categories={data.categories}
              query={query}
              filter={filter}
              categoryFilter={categoryFilter}
              onQueryChange={setQuery}
              onFilterChange={setFilter}
              onCategoryFilterChange={setCategoryFilter}
              onReset={() => { setQuery(''); setFilter('All stock'); setCategoryFilter('All categories') }}
              {...productActions}
            />
          )}

          {page === 'Categories' && (
            <CategoriesPage
              categories={data.categories}
              products={data.products}
              onViewProducts={id => { setCategoryFilter(id); setPage('Products') }}
              onRename={c => {
                const name = prompt('Category name', c.name)
                if (name) inventory.renameCategory(c.id, name)
              }}
              onDelete={(c, count) => {
                if (count) return notify('Reassign products before deleting this category')
                if (confirm(`Delete ${c.name}?`)) inventory.deleteCategory(c.id)
              }}
            />
          )}

          {page === 'Stock management' && (
            <StockPage
              allProducts={data.products}
              products={products}
              categories={data.categories}
              query={query}
              stockType={stockType}
              stockForm={stockForm}
              onQueryChange={setQuery}
              onStockTypeChange={changeStockType}
              onStockFormChange={setStockForm}
              onSubmit={submitStock}
              {...productActions}
            />
          )}

          {page === 'Transactions' && (
            <TransactionsPage transactions={data.transactions} query={query} onQueryChange={setQuery} />
          )}
        </div>
      </section>

      {(modal === 'add' || modal === 'edit') && (
        <ProductFormModal
          mode={modal}
          form={form}
          categories={data.categories}
          onChange={setForm}
          onClose={closeModal}
          onSubmit={submitProduct}
        />
      )}
      {modal === 'details' && selected && (
        <ProductDetailsModal
          product={selected}
          categories={data.categories}
          onClose={closeModal}
          onManageStock={() => {
            closeModal()
            setStockForm(f => ({ ...f, productId: selected.id }))
            setPage('Stock management')
          }}
          onEdit={() => openEdit(selected)}
        />
      )}
      <Toast message={toast} />
    </main>
  )
}
