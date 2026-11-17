import { AlertTriangle, ArrowUpRight, Boxes, BriefcaseBusiness, MoreHorizontal, Package, TrendingDown, TrendingUp } from 'lucide-react'
import { CATEGORY_COLORS, buildDonutGradient, currency, unitsInCategory } from '@/lib/inventory'
import { ProductTable, type ProductActions } from '@/components/tables/ProductTable'
import { TransactionTable } from '@/components/tables/TransactionTable'
import type { Inventory, PageName, Product, StockFilter } from '@/types/inventory'

type Props = ProductActions & {
  data: Inventory
  low: Product[]
  out: Product[]
  totalUnits: number
  inventoryValue: number
  onNavigate: (page: PageName, filter?: StockFilter) => void
}

export function OverviewPage({ data, low, out, totalUnits, inventoryValue, onNavigate, ...actions }: Props) {
  const { categories, products, transactions } = data
  const countByStatus = [products.filter(p => p.quantity > p.minStock).length, low.length, out.length]
  const attention = [...out, ...low].slice(0, 5)

  return (
    <>
      <div className="overview-strip">
        <span className="live-marker"><i /> LIVE INVENTORY</span>
        <span>Last updated just now</span>
        <span className="strip-divider" />
        <span>{products.length} active SKUs</span>
        <span className="overview-date">15 NOVEMBER 2026</span>
      </div>

      <div className="stats-grid">
        <button className="stat-card" onClick={() => onNavigate('Products', 'All stock')}>
          <div className="stat-top"><span>TOTAL PRODUCTS</span><Package size={17} /></div>
          <div className="stat-value">{String(products.length).padStart(2, '0')}</div>
          <div className="stat-foot"><span className="stat-note">Across {categories.length} categories</span><span className="stat-trend"><TrendingUp size={13} /> 4.8%</span></div>
        </button>
        <button className="stat-card" onClick={() => onNavigate('Categories')}>
          <div className="stat-top"><span>TOTAL UNITS</span><Boxes size={17} /></div>
          <div className="stat-value">{totalUnits.toLocaleString('en-IN')}</div>
          <div className="stat-foot"><span className="stat-note">Available in stock</span><span className="stat-trend"><TrendingUp size={13} /> 2.1%</span></div>
        </button>
        <button className="stat-card" onClick={() => onNavigate('Products', 'Low stock')}>
          <div className="stat-top"><span>LOW STOCK</span><TrendingDown size={17} /></div>
          <div className="stat-value">{String(low.length).padStart(2, '0')}<span className="stat-unit">items</span></div>
          <div className="stat-foot"><span className="stat-note">Below minimum threshold</span><span className="stat-attention">Needs attention</span></div>
        </button>
        <button className="stat-card" onClick={() => onNavigate('Products', 'Out of stock')}>
          <div className="stat-top"><span>OUT OF STOCK</span><AlertTriangle size={17} /></div>
          <div className="stat-value">{String(out.length).padStart(2, '0')}<span className="stat-unit">items</span></div>
          <div className="stat-foot"><span className="stat-note">Currently unavailable</span><span className="stat-attention">Action required</span></div>
        </button>
        <button className="stat-card value-card">
          <div className="stat-top"><span>INVENTORY VALUE</span><BriefcaseBusiness size={17} /></div>
          <div className="stat-value compact">{currency(inventoryValue)}</div>
          <div className="stat-foot"><span className="stat-note">At current unit prices</span><span className="stat-trend"><TrendingUp size={13} /> 6.3%</span></div>
        </button>
      </div>

      <div className="dashboard-grid">
        <section className="panel category-panel">
          <div className="panel-heading">
            <div><div className="panel-kicker">DISTRIBUTION</div><h2>Inventory by category</h2></div>
            <button className="icon-button" aria-label="Category options"><MoreHorizontal /></button>
          </div>
          <div className="category-content">
            <div className="donut" style={{ background: buildDonutGradient(categories, products, totalUnits) }}>
              <div className="donut-center"><strong>{totalUnits.toLocaleString('en-IN')}</strong><span>total units</span></div>
            </div>
            <div className="legend">
              {categories.map((c, i) => (
                <div className="legend-row" key={c.id}>
                  <span className="legend-dot" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                  <span>{c.name}</span>
                  <strong>{unitsInCategory(products, c.id)}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-foot">UNIT COUNT BY PRODUCT CATEGORY <ArrowUpRight size={13} /></div>
        </section>

        <section className="panel stock-panel">
          <div className="panel-heading">
            <div><div className="panel-kicker">HEALTH CHECK</div><h2>Stock status</h2></div>
            <button className="text-action" onClick={() => onNavigate('Products', 'All stock')}>View products <ArrowUpRight size={14} /></button>
          </div>
          <div className="stock-visual">
            <div className="bar-chart">
              {['In stock', 'Low stock', 'Out of stock'].map((label, i) => (
                <div className="bar-item" key={label}>
                  <div className="bar-track">
                    <div className={`bar-fill bar-${i}`} style={{ height: `${Math.max(8, (countByStatus[i] / Math.max(1, products.length)) * 100)}%` }} />
                  </div>
                  <strong>{countByStatus[i]}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-summary">
            <span><i className="summary-dot green" />Healthy</span>
            <span><i className="summary-dot ochre" />Low stock</span>
            <span><i className="summary-dot red" />Out of stock</span>
          </div>
        </section>
      </div>

      <section className="panel data-panel">
        <div className="panel-heading table-heading">
          <div>
            <div className="panel-kicker">REPLENISHMENT QUEUE <span className="count-bubble">{low.length + out.length}</span></div>
            <h2>Needs attention</h2>
          </div>
          <button className="text-action" onClick={() => onNavigate('Products', 'Low stock')}>View all <ArrowUpRight size={14} /></button>
        </div>
        <ProductTable rows={attention} categories={categories} {...actions} />
      </section>

      <section className="panel data-panel">
        <div className="panel-heading table-heading">
          <div><div className="panel-kicker">LATEST ACTIVITY</div><h2>Recent transactions</h2></div>
          <button className="text-action" onClick={() => onNavigate('Transactions')}>All transactions <ArrowUpRight size={14} /></button>
        </div>
        <TransactionTable rows={transactions.slice(0, 5)} />
      </section>
    </>
  )
}
