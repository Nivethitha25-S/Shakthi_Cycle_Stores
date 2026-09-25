import { useState, useEffect } from 'react';
import { salesApi } from '../services/api';

function SalesHistory({ onViewInvoice, onNavigate }) {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('ALL');

  const fetchSales = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await salesApi.getAll();
      setSales(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    let result = [...sales];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          (s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(q)) ||
          (s.customerName && s.customerName.toLowerCase().includes(q)) ||
          (s.customerPhone && s.customerPhone.toLowerCase().includes(q))
      );
    }

    if (selectedPaymentFilter !== 'ALL') {
      result = result.filter((s) => s.paymentMethod === selectedPaymentFilter);
    }

    setFilteredSales(result);
  }, [sales, searchQuery, selectedPaymentFilter]);

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

  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Sales & Invoicing History</h2>
          <p className="text-muted mb-0 small">
            View all recorded customer billing transactions, invoice receipts, and revenue logs.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={fetchSales}
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
            <span>New Sale</span>
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
          <button className="btn btn-sm btn-outline-danger" onClick={fetchSales}>
            Retry
          </button>
        </div>
      )}

      {/* Summary Banner */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-white-50 text-uppercase fw-semibold">Filtered Invoices Count</small>
                <h3 className="fw-bold mb-0 mt-1">{filteredSales.length}</h3>
              </div>
              <i className="bi bi-receipt fs-1 text-white-50"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-success text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-white-50 text-uppercase fw-semibold">Total Filtered Revenue</small>
                <h3 className="fw-bold mb-0 mt-1">{formatCurrency(totalSalesRevenue)}</h3>
              </div>
              <i className="bi bi-currency-rupee fs-1 text-white-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by invoice number (e.g., INV-), customer name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="btn btn-light border" type="button" onClick={() => setSearchQuery('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small fw-semibold text-nowrap">Payment Mode:</label>
              <select
                className="form-select bg-light"
                value={selectedPaymentFilter}
                onChange={(e) => setSelectedPaymentFilter(e.target.value)}
              >
                <option value="ALL">All Modes</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="NET_BANKING">Net Banking</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2 small">Loading transaction records...</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
          <i className="bi bi-receipt-cutoff fs-1 text-secondary d-block mb-3"></i>
          <h5 className="fw-semibold text-dark">No Sales Records Found</h5>
          <p className="text-muted small">
            {searchQuery
              ? 'No billing records match your search criteria.'
              : 'No sales have been generated yet. Use New Sale to create your first bill.'}
          </p>
        </div>
      ) : (
        <div className="table-responsive rounded-4 shadow-sm bg-white border border-light">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark text-nowrap">
              <tr>
                <th scope="col" className="ps-4">Invoice #</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Date & Time</th>
                <th scope="col" className="text-end">Subtotal</th>
                <th scope="col" className="text-end">Discount</th>
                <th scope="col" className="text-end">Total Amount</th>
                <th scope="col" className="text-center">Payment Mode</th>
                <th scope="col" className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="ps-4">
                    <span className="badge bg-dark font-monospace fs-6 px-3 py-2">
                      {sale.invoiceNumber}
                    </span>
                  </td>
                  <td>
                    <strong className="text-dark d-block">{sale.customerName}</strong>
                    {sale.customerPhone && (
                      <small className="text-muted">
                        <i className="bi bi-telephone me-1"></i>
                        {sale.customerPhone}
                      </small>
                    )}
                  </td>
                  <td className="text-muted small">
                    {formatDate(sale.saleDate)}
                  </td>
                  <td className="text-end text-secondary fw-medium">
                    {formatCurrency(sale.subtotal)}
                  </td>
                  <td className="text-end text-danger fw-medium">
                    {sale.discount > 0 ? `- ${sale.discount}%` : '—'}
                  </td>
                  <td className="text-end fw-bold text-dark fs-6">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-info-subtle text-info-emphasis border px-3 py-2 fw-semibold">
                      {sale.paymentMethod || 'CASH'}
                    </span>
                  </td>
                  <td className="text-end pe-4 text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                      onClick={() => onViewInvoice && onViewInvoice(sale)}
                      title="View & Print Invoice"
                    >
                      <i className="bi bi-receipt"></i>
                      <span>View Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SalesHistory;
