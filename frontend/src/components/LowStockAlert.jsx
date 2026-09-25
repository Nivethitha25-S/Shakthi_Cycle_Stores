function LowStockAlert({ lowStockProducts = [], onRestockClick }) {
  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 bg-success bg-opacity-10 border-start border-4 border-success p-3">
        <div className="d-flex align-items-center gap-3">
          <i className="bi bi-check-circle-fill text-success fs-3"></i>
          <div>
            <h6 className="fw-bold text-success mb-0">Stock Levels are Healthy</h6>
            <small className="text-muted">All inventory items are currently above minimum threshold limits.</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden border-start border-4 border-danger">
      <div className="card-header bg-danger bg-opacity-10 py-3 px-4 border-0 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
          <h6 className="fw-bold text-danger mb-0">
            Low Stock Alerts ({lowStockProducts.length} Items Need Attention)
          </h6>
        </div>
        <span className="badge bg-danger rounded-pill px-3 py-1">Action Required</span>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr style={{ fontSize: '0.82rem' }}>
                <th scope="col" className="ps-4">Product</th>
                <th scope="col">Category</th>
                <th scope="col" className="text-center">Current Stock</th>
                <th scope="col" className="text-center">Min Threshold</th>
                <th scope="col">Supplier</th>
                <th scope="col" className="text-end pe-4">Quick Restock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => (
                <tr key={p.id}>
                  <td className="ps-4">
                    <strong className="text-dark d-block">{p.productName}</strong>
                    <small className="text-muted">{p.brand} {p.model}</small>
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-dark border px-2 py-1">
                      {p.category}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-danger px-3 py-2 fs-6 fw-bold">
                      {p.stockQuantity ?? 0}
                    </span>
                  </td>
                  <td className="text-center text-muted fw-medium">
                    {p.minimumStock ?? 5}
                  </td>
                  <td className="text-secondary small">
                    {p.supplier || '—'}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1"
                      onClick={() => onRestockClick && onRestockClick(p)}
                    >
                      <i className="bi bi-box-arrow-in-down"></i>
                      <span>Restock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LowStockAlert;
