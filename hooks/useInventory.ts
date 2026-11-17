'use client'

import { useEffect, useState } from 'react'
import { seed } from '@/lib/seed'
import type { Inventory, Product, ProductForm, StockForm, StockType, Transaction } from '@/types/inventory'

const STORAGE_KEY = 'stockflow-inventory'

export function useInventory(notify: (message: string) => void) {
  const [data, setData] = useState<Inventory>(seed)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setData(JSON.parse(saved))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data, ready])

  /** Returns true on success so the caller can close its dialog. */
  const addProduct = (form: ProductForm): boolean => {
    const name = form.name.trim()
    const price = Number(form.price)
    const quantity = Number(form.quantity)
    const minStock = Number(form.minStock)
    if (!name || !form.categoryId || !Number.isFinite(price) || price < 0 || quantity < 0 || minStock < 0) {
      notify('Check the required fields and values')
      return false
    }
    if (data.products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      notify('A product with this name already exists')
      return false
    }
    const product: Product = {
      id: `P${String(Date.now()).slice(-5)}`,
      name,
      categoryId: form.categoryId,
      description: form.description,
      price,
      quantity,
      minStock,
      createdAt: new Date().toISOString(),
    }
    const transaction: Transaction = {
      id: `T${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: 'STOCK_IN',
      quantity,
      previousStock: 0,
      updatedStock: quantity,
      reason: 'Initial Stock',
      date: new Date().toISOString(),
    }
    setData(d => ({
      ...d,
      products: [product, ...d.products],
      transactions: quantity > 0 ? [transaction, ...d.transactions] : d.transactions,
    }))
    notify('Product added to inventory')
    return true
  }

  const updateProduct = (id: string, form: ProductForm): boolean => {
    const name = form.name.trim()
    if (!name || data.products.some(p => p.id !== id && p.name.toLowerCase() === name.toLowerCase())) {
      notify('Enter a unique product name')
      return false
    }
    setData(d => ({
      ...d,
      products: d.products.map(p =>
        p.id === id
          ? {
              ...p,
              name,
              categoryId: form.categoryId,
              description: form.description,
              price: Number(form.price) || 0,
              minStock: Number(form.minStock) || 0,
            }
          : p
      ),
    }))
    notify('Product updated')
    return true
  }

  const deleteProduct = (p: Product) => {
    if (confirm(`Remove ${p.name} from active inventory? Historical transactions will be retained.`)) {
      setData(d => ({ ...d, products: d.products.filter(x => x.id !== p.id) }))
      notify('Product removed; transaction history retained')
    }
  }

  const recordStock = (type: StockType, form: StockForm): boolean => {
    const p = data.products.find(x => x.id === form.productId)
    const amount = Number(form.quantity)
    if (!p || !Number.isInteger(amount) || amount <= 0 || (type === 'STOCK_OUT' && amount > p.quantity)) {
      notify('Enter a valid quantity for this stock operation')
      return false
    }
    const next = p.quantity + (type === 'STOCK_IN' ? amount : -amount)
    const tx: Transaction = {
      id: `T${Date.now()}`,
      productId: p.id,
      productName: p.name,
      type,
      quantity: amount,
      previousStock: p.quantity,
      updatedStock: next,
      reason: form.reason,
      date: new Date().toISOString(),
    }
    setData(d => ({
      ...d,
      products: d.products.map(x => (x.id === p.id ? { ...x, quantity: next } : x)),
      transactions: [tx, ...d.transactions],
    }))
    notify('Stock transaction recorded')
    return true
  }

  const addCategory = (rawName: string) => {
    const name = rawName.trim()
    if (!name) return
    if (data.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      notify('Category already exists')
      return
    }
    setData(d => ({
      ...d,
      categories: [...d.categories, { id: `C${Date.now().toString().slice(-5)}`, name, description: 'New category' }],
    }))
    notify('Category added')
  }

  const renameCategory = (id: string, rawName: string) => {
    const name = rawName.trim()
    if (!name) return
    if (data.categories.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
      notify('Category already exists')
      return
    }
    setData(d => ({ ...d, categories: d.categories.map(c => (c.id === id ? { ...c, name } : c)) }))
    notify('Category updated')
  }

  const deleteCategory = (id: string) => {
    setData(d => ({ ...d, categories: d.categories.filter(c => c.id !== id) }))
  }

  const resetDemo = () => {
    setData(seed)
    notify('Demo inventory restored')
  }

  return {
    data,
    addProduct,
    updateProduct,
    deleteProduct,
    recordStock,
    addCategory,
    renameCategory,
    deleteCategory,
    resetDemo,
  }
}
