export type Category = { id: string; name: string; description: string }

export type Product = {
  id: string
  name: string
  categoryId: string
  description: string
  price: number
  quantity: number
  minStock: number
  createdAt: string
}

export type StockType = 'STOCK_IN' | 'STOCK_OUT'

export type Transaction = {
  id: string
  productId: string
  productName: string
  type: StockType
  quantity: number
  previousStock: number
  updatedStock: number
  reason: string
  date: string
}

export type Inventory = {
  categories: Category[]
  products: Product[]
  transactions: Transaction[]
}

export type PageName = 'Overview' | 'Products' | 'Categories' | 'Stock management' | 'Transactions'

export type StockFilter = 'All stock' | 'In stock' | 'Low stock' | 'Out of stock'

export type ProductForm = {
  name: string
  categoryId: string
  description: string
  price: string
  quantity: string
  minStock: string
}

export type StockForm = {
  productId: string
  quantity: string
  reason: string
}
