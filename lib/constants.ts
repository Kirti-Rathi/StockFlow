import { ArrowLeftRight, ClipboardList, LayoutDashboard, Package, Tags, type LucideIcon } from 'lucide-react'
import type { PageName, StockFilter } from '@/types/inventory'

export const NAV_ITEMS: { label: PageName; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Categories', icon: Tags },
  { label: 'Stock management', icon: ArrowLeftRight },
  { label: 'Transactions', icon: ClipboardList },
]

export const STOCK_FILTERS: StockFilter[] = ['All stock', 'In stock', 'Low stock', 'Out of stock']

export const PAGE_DESCRIPTIONS: Record<PageName, string> = {
  Overview: 'Here’s what’s happening with your inventory today.',
  Products: 'Manage your catalog, pricing and stock levels.',
  Categories: 'Organize products into clear, manageable groups.',
  'Stock management': 'Record incoming and outgoing inventory movements.',
  Transactions: 'A complete record of inventory movements.',
}

export const STOCK_IN_REASONS = ['Purchase', 'Return', 'Initial Stock', 'Other']
export const STOCK_OUT_REASONS = ['Sale', 'Internal Use', 'Damaged', 'Other']
