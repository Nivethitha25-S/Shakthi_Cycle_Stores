import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LowStockAlert from '../components/LowStockAlert';

function Dashboard({ onNavigate, onRestockProduct, onViewInvoice }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Store Dashboard</h2>
          <p className="text-muted mb-0 small">
            Live overview of sales, inventory stock levels, and store analytics.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
          
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => onNavigate('new-sale')}
          >
            <i className="bi bi-plus-circle"></i>
            <span>New Sale / Bill</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between py-3 px-4 rounded-4 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>{error}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      )}

      {/* 5 KPI Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl">
          <DashboardCard
            title="Total Products"
            value={stats?.totalProducts}
            icon="bi-box-seam"
            color="primary"
            subtitle="Unique product SKUs in catalog"
            loading={loading}
            onClick={() => onNavigate('inventory')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <DashboardCard
            title="Current Stock"
            value={stats?.totalStock}
            icon="bi-boxes"
            color="success"
            subtitle="Total units in inventory"
            loading={loading}
            onClick={() => onNavigate('inventory')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <DashboardCard
            title="Today's Sales"
            value={stats?.todaySalesCount}
            icon="bi-receipt"
            color="info"
            subtitle="Invoices generated today"
            loading={loading}
            onClick={() => onNavigate('sales-history')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <DashboardCard
            title="Today's Revenue"
            value={formatCurrency(stats?.todayRevenue)}
            icon="bi-currency-rupee"
            color="success"
            subtitle="Gross income collected today"
            loading={loading}
            onClick={() => onNavigate('sales-history')}
          />
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <DashboardCard
            title="Low Stock Products"
            value={stats?.lowStockCount}
            icon="bi-exclamation-octagon"
            color="danger"
            subtitle="Items at or below minimum threshold"
            loading={loading}
            onClick={() => onNavigate('inventory')}
          />
        </div>
      </div>

      {/* Main Grid: Low Stock Warnings & Top Selling Products */}
      <div className="row g-4 mb-4">
        {/* Low Stock Warning Section */}
        <div className="col-12 col-lg-7">
          <LowStockAlert
            lowStockProducts={stats?.lowStockProducts || []}
            onRestockClick={(product) => {
              if (onRestockProduct) {
                onRestockProduct(product);
              } else {
                onNavigate('stock-intake');
              }
            }}
          />
        </div>

        {/* Top Selling Products */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white py-3 px-4 border-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-trophy-fill text-warning"></i>
                Top Selling Products
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none p-0"
                onClick={() => onNavigate('analytics')}
              >
                View Analytics &rarr;
              </button>
            </div>

            <div className="card-body p-0">
              {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.topSellingProducts.map((p, idx) => (
                    <li key={p.productId || idx} className="list-group-item d-flex justify-content-between align-items-center py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-light text-dark border rounded-circle p-2 fw-bold" style={{ width: '32px', height: '32px' }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <strong className="text-dark d-block">{p.productName}</strong>
                          <small className="text-muted">{p.category} &bull; {p.brand || 'Standard'}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary-subtle text-primary px-2 py-1 fw-bold d-block mb-1">
                          {p.quantitySold} Sold
                        </span>
                        <small className="fw-semibold text-dark">
                          {formatCurrency(p.totalRevenue)}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-graph-up fs-2 d-block mb-2 text-secondary"></i>
                  <p className="small mb-0">No sales recorded yet for top products ranking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Activity */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white py-3 px-4 border-0 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-clock-history text-primary"></i>
            Recent Billing Transactions
          </h6>
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-0"
            onClick={() => onNavigate('sales-history')}
          >
            All Sales &rarr;
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr style={{ fontSize: '0.82rem' }}>
                  <th scope="col" className="ps-4">Invoice #</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Date & Time</th>
                  <th scope="col">Payment Mode</th>
                  <th scope="col" className="text-end">Total Amount</th>
                  <th scope="col" className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentSales && stats.recentSales.length > 0 ? (
                  stats.recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="ps-4">
                        <span className="badge bg-dark font-monospace px-2 py-1">
                          {sale.invoiceNumber}
                        </span>
                      </td>
                      <td>
                        <strong className="text-dark d-block">{sale.customerName}</strong>
                        <small className="text-muted">{sale.customerPhone || 'No phone'}</small>
                      </td>
                      <td className="text-muted small">
                        {formatDate(sale.saleDate)}
                      </td>
                      <td>
                        <span className="badge bg-info-subtle text-info-emphasis border px-2 py-1">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-dark">
                        {formatCurrency(sale.totalAmount)}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                          onClick={() => onViewInvoice && onViewInvoice(sale)}
                        >
                          <i className="bi bi-receipt"></i>
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted small">
                      No recent sales found. Create your first bill using "New Sale".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
