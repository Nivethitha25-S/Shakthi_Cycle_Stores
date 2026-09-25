function Invoice({ sale, onNavigate, onNewSale }) {
  if (!sale) {
    return (
      <div className="container p-4 text-center py-5">
        <div className="card border-0 shadow-sm rounded-4 p-5 bg-white">
          <i className="bi bi-receipt-cutoff fs-1 text-secondary d-block mb-3"></i>
          <h4 className="fw-bold text-dark">No Invoice Selected</h4>
          <p className="text-muted">Please create a new sale or select an invoice from the Sales History.</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-primary" onClick={() => onNavigate('new-sale')}>
              Create New Sale
            </button>
            <button className="btn btn-outline-secondary" onClick={() => onNavigate('sales-history')}>
              View Sales History
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleString('en-IN');
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const discountPct = Number(sale.discount) || 0;
  const discountAmount = sale.discountAmount != null
    ? Number(sale.discountAmount)
    : ((Number(sale.subtotal) || 0) * discountPct) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-4">
      {/* Action Buttons (Hidden when printing) */}
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => onNavigate('sales-history')}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Sales History</span>
        </button>

        <div className="d-flex gap-2">
          {onNewSale && (
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={onNewSale}
            >
              <i className="bi bi-plus-circle"></i>
              <span>New Sale</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-success d-flex align-items-center gap-2 px-4 shadow-sm"
            onClick={handlePrint}
          >
            <i className="bi bi-printer-fill"></i>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Paper Card */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white invoice-paper mx-auto" style={{ maxWidth: '850px' }}>
        {/* Invoice Header */}
        <div className="bg-dark text-white p-4 p-md-5 border-bottom border-4 border-primary">
          <div className="row align-items-center">
            <div className="col-12 col-md-7">
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="badge bg-danger p-2 rounded-circle">
                  <i className="bi bi-bicycle fs-4"></i>
                </span>
                <h3 className="fw-bold mb-0 text-white tracking-wide">
                  Shakthi Cycle Stores And Autos
                </h3>
              </div>
              <p className="text-white-50 small mb-1">
                Authorized Dealer in Premium Bicycles, Genuine Spares, Tyres & Complete Accessories
              </p>
              <small className="text-secondary">
                Main Road, Market Hub &bull; GSTIN: 33AAAAA0000A1Z5 &bull; Ph: +91 98765 43210
              </small>
            </div>

            <div className="col-12 col-md-5 text-md-end mt-4 mt-md-0">
              <span className="badge bg-primary fs-6 px-3 py-2 fw-bold text-uppercase mb-2 d-inline-block">
                Tax Invoice / Receipt
              </span>
              <div className="text-white font-monospace fs-5 fw-bold">
                {sale.invoiceNumber}
              </div>
              <small className="text-white-50 d-block">
                Date: {formatDate(sale.saleDate)}
              </small>
            </div>
          </div>
        </div>

        {/* Customer & Bill Info Section */}
        <div className="p-4 p-md-5">
          <div className="row g-3 mb-4 pb-3 border-bottom">
            <div className="col-12 col-sm-6">
              <span className="text-secondary small text-uppercase fw-semibold d-block">Billed To:</span>
              <h5 className="fw-bold text-dark mb-1">{sale.customerName || 'Walk-in Customer'}</h5>
              {sale.customerPhone && (
                <div className="text-muted small">
                  <i className="bi bi-telephone me-1"></i>
                  {sale.customerPhone}
                </div>
              )}
            </div>

            <div className="col-12 col-sm-6 text-sm-end">
              <span className="text-secondary small text-uppercase fw-semibold d-block">Payment Mode:</span>
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 fs-6 fw-bold">
                {sale.paymentMethod || 'CASH'}
              </span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  <th scope="col" style={{ width: '50px' }} className="text-center">#</th>
                  <th scope="col">Product Description</th>
                  <th scope="col" className="text-center" style={{ width: '90px' }}>Qty</th>
                  <th scope="col" className="text-end" style={{ width: '130px' }}>Unit Price</th>
                  <th scope="col" className="text-end" style={{ width: '140px' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="text-center text-muted fw-semibold">{index + 1}</td>
                      <td>
                        <strong className="text-dark d-block">{item.productName}</strong>
                        {item.category && (
                          <small className="text-muted">{item.category} {item.brand ? `• ${item.brand}` : ''}</small>
                        )}
                      </td>
                      <td className="text-center fw-bold fs-6 text-dark">{item.quantity}</td>
                      <td className="text-end fw-medium text-dark">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-end fw-bold text-dark">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-muted">
                      No items listed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary Calculation */}
          <div className="row justify-content-end mb-4">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="bg-light p-3 rounded-3">
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Subtotal:</span>
                  <span className="fw-semibold text-dark">{formatCurrency(sale.subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between text-danger mb-2">
                  <span>Discount ({discountPct}%):</span>
                  <span className="fw-semibold">- {formatCurrency(discountAmount)}</span>
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-between align-items-center pt-1">
                  <strong className="fs-5 text-dark">Grand Total:</strong>
                  <strong className="fs-3 text-primary fw-bold">{formatCurrency(sale.totalAmount)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Footer */}
          <div className="pt-4 border-top">
            <div className="row text-muted small">
              <div className="col-12 col-md-7">
                <strong className="text-dark d-block mb-1">Terms & Conditions:</strong>
                <ul className="ps-3 mb-0" style={{ fontSize: '0.78rem' }}>
                  <li>Goods once sold will not be returned unless manufacturing defect.</li>
                  <li>Free 1st general bicycle servicing valid within 30 days of purchase.</li>
                  <li>Warranty claims subject to manufacturer terms with original invoice.</li>
                </ul>
              </div>

              <div className="col-12 col-md-5 text-md-end mt-4 mt-md-0 d-flex flex-column justify-content-end align-items-md-end">
                <div className="border-bottom border-dark pb-1 mb-1" style={{ width: '180px' }}></div>
                <strong className="text-dark">Authorized Signatory</strong>
                <small>For Shakthi Cycle Stores And Autos</small>
              </div>
            </div>
          </div>

          <div className="text-center text-muted mt-5 pt-3 border-top" style={{ fontSize: '0.75rem' }}>
            Thank you for shopping at Shakthi Cycle Stores And Autos! Have a safe and happy ride!
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
