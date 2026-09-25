import React from 'react';
import logoImg from '../assets/logo.png';

export default function InvoiceModal({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-light border-bottom no-print">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-primary"></i> Invoice - {sale.invoiceNumber}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 printable-invoice">
            {/* Invoice Header */}
            <div className="row pb-3 mb-4 border-bottom align-items-center">
              <div className="col-sm-7">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <img
                    src={logoImg}
                    alt="Shakthi Cycle Stores"
                    height="60"
                    className="rounded shadow-sm"
                  />
                  <div>
                    <h4 className="fw-bold text-dark mb-0">SHAKTHI CYCLE STORES AND AUTOS</h4>
                    <small className="text-muted fw-semibold">Bicycles, Auto Accessories & Certified Service Center</small>
                  </div>
                </div>
                <div className="text-secondary small ps-1">
                  <div>124, Grand Trunk Cycle Road, Main Bazaar, City Center</div>
                  <div>Phone: +91 98765 43210 / +91 98765 43211 | GSTIN: 33SHAKT1234F1Z9</div>
                </div>
              </div>

              <div className="col-sm-5 text-sm-end mt-3 mt-sm-0">
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fs-6 mb-2">
                  <i className="bi bi-check-circle-fill me-1"></i> PAID IN FULL
                </span>
                <div className="text-secondary small">
                  <div><strong>Invoice #:</strong> <span className="text-dark fw-bold">{sale.invoiceNumber}</span></div>
                  <div><strong>Date:</strong> {formatDate(sale.saleDate)}</div>
                  <div><strong>Payment Mode:</strong> <span className="badge bg-secondary">{sale.paymentMethod}</span></div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-light p-3 rounded-3 mb-4">
              <div className="row">
                <div className="col-sm-6">
                  <span className="text-muted small text-uppercase fw-bold">Billed To:</span>
                  <h6 className="fw-bold text-dark mb-1">{sale.customerName || 'Walk-in Customer'}</h6>
                  <div className="text-secondary small">
                    <i className="bi bi-telephone me-1"></i> {sale.customerPhone || 'N/A'}
                  </div>
                </div>
                <div className="col-sm-6 text-sm-end mt-2 mt-sm-0">
                  <span className="text-muted small text-uppercase fw-bold">Issued By:</span>
                  <div className="text-dark fw-semibold">Shakthi Cycle Stores Billing Counter</div>
                  <div className="text-muted small">Authorized Computerized Receipt</div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>Product / Model Description</th>
                    <th>Category</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items && sale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-center">{idx + 1}</td>
                      <td>
                        <strong className="text-dark">{item.productName}</strong>
                        {item.brand && <span className="text-muted small d-block">Brand: {item.brand}</span>}
                      </td>
                      <td><span className="badge bg-light text-dark border">{item.category || 'General'}</span></td>
                      <td className="text-end">₹{parseFloat(item.unitPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="text-center fw-bold">{item.quantity}</td>
                      <td className="text-end fw-bold">₹{parseFloat(item.totalPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="row justify-content-end mb-4">
              <div className="col-sm-6">
                <div className="border rounded-3 p-3 bg-light">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal:</span>
                    <span className="fw-semibold">₹{parseFloat(sale.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {sale.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Discount Applied:</span>
                      <span>-₹{parseFloat(sale.discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
                    <span>Grand Total:</span>
                    <span className="text-primary">₹{parseFloat(sale.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Footer */}
            <div className="border-top pt-3 text-center text-muted small">
              <p className="mb-0 fw-bold text-dark">Thank you for visiting Shakthi Cycle Stores And Autos!</p>
            </div>
          </div>

          <div className="modal-footer bg-light border-top no-print">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handlePrint}>
              <i className="bi bi-printer-fill"></i> Print Bill / Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
