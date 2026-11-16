import type { Category, Product } from '@/types/inventory'

export const CATEGORY_COLORS = ['#d7ff4f', '#62d5ed', '#bd28f5', '#ed5629', '#ed2b78']

export const currency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export const stockState = (p: Product) =>
  p.quantity === 0 ? 'Out of stock' : p.quantity <= p.minStock ? 'Low stock' : 'In stock'

export const statusClass = (s: string) =>
  s === 'In stock' ? 'status-good' : s === 'Low stock' ? 'status-low' : 'status-out'

export const getCategoryName = (categories: Category[], id: string) =>
  categories.find(c => c.id === id)?.name ?? 'Unassigned'

export const unitsInCategory = (products: Product[], categoryId: string) =>
  products.filter(p => p.categoryId === categoryId).reduce((n, p) => n + p.quantity, 0)

export function getStockStats(products: Product[]) {
  const low = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock)
  const out = products.filter(p => p.quantity === 0)
  const totalUnits = products.reduce((n, p) => n + p.quantity, 0)
  const inventoryValue = products.reduce((n, p) => n + p.quantity * p.price, 0)
  return { low, out, totalUnits, inventoryValue }
}

export function buildDonutGradient(categories: Category[], products: Product[], totalUnits: number) {
  const stops = categories.map((c, i) => {
    const start = categories.slice(0, i).reduce((sum, prior) => sum + unitsInCategory(products, prior.id), 0)
    const value = unitsInCategory(products, c.id)
    const from = totalUnits ? (start / totalUnits) * 100 : 0
    const to = totalUnits ? ((start + value) / totalUnits) * 100 : 0
    return `${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} ${from}% ${to}%`
  })
  return `conic-gradient(${stops.join(',') || '#e5e4dc 0% 100%'})`
}
