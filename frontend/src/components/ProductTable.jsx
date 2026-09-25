import React from 'react';

function ProductTable({
  products = [],
  loading = false,
  onEdit,
  onDelete,
  onIntakeStock,
  onSelectProduct
}) {
  const getStatusBadge = (product) => {
    const stock = product.stockQuantity ?? 0;
    const minStock = product.minimumStock ?? 5;
    const status = product.stockStatus || (stock === 0 ? 'OUT_OF_STOCK' : stock <= minStock ? 'LOW_STOCK' : 'IN_STOCK');

    switch (status) {
      case 'OUT_OF_STOCK':
        return <span className="badge bg-danger rounded-pill px-3 py-2 fw-semibold">OUT OF STOCK</span>;
      case 'LOW_STOCK':
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-semibold">LOW STOCK</span>;
      case 'IN_STOCK':
      default:
        return <span className="badge bg-success rounded-pill px-3 py-2 fw-semibold">IN STOCK</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading inventory...</span>
        </div>
        <p className="text-muted mt-2">Loading products from database...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5 bg-light rounded-4 border border-dashed p-4">
        <i className="bi bi-box-seam text-secondary fs-1 d-block mb-3"></i>
        <h5 className="fw-semibold text-dark">No Products Found</h5>
        <p className="text-muted small">No items match your search or your inventory is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive rounded-4 shadow-sm bg-white border border-light">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark text-nowrap">
          <tr>
            <th scope="col" className="ps-4">Product Name</th>
            <th scope="col">Category</th>
            <th scope="col">Brand & Model</th>
            <th scope="col" className="text-end">Selling Price</th>
            <th scope="col" className="text-center">Stock</th>
            <th scope="col" className="text-center">Min Stock</th>
            <th scope="col">Supplier</th>
            <th scope="col" className="text-center">Status</th>
            <th scope="col" className="text-end pe-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isLow = (product.stockQuantity ?? 0) <= (product.minimumStock ?? 5);
            return (
              <tr key={product.id} className={isLow ? 'table-warning bg-opacity-25' : ''}>
                <td className="ps-4">
                  <div className="fw-bold text-dark">{product.productName}</div>
                  <small className="text-muted">ID: #{product.id}</small>
                </td>
                <td>
                  <span className="badge bg-secondary-subtle text-secondary border px-2 py-1 rounded-2">
                    {product.category || 'General'}
                  </span>
                </td>
                <td>
                  <div className="text-dark fw-medium">{product.brand || '—'}</div>
                  <small className="text-muted">{product.model || ''}</small>
                </td>
                <td className="text-end fw-bold text-dark">
                  {formatCurrency(product.sellingPrice)}
                  {product.purchasePrice && (
                    <div className="text-muted small fw-normal" style={{ fontSize: '0.72rem' }}>
                      Cost: {formatCurrency(product.purchasePrice)}
                    </div>
                  )}
                </td>
                <td className="text-center">
                  <span className={`fw-bold fs-6 ${isLow ? 'text-danger' : 'text-dark'}`}>
                    {product.stockQuantity ?? 0}
                  </span>
                </td>
                <td className="text-center text-muted">
                  {product.minimumStock ?? 5}
                </td>
                <td>
                  <span className="text-secondary small">{product.supplier || '—'}</span>
                </td>
                <td className="text-center">
                  {getStatusBadge(product)}
                </td>
                <td className="text-end pe-4 text-nowrap">
                  <div className="btn-group btn-group-sm" role="group">
                    {onIntakeStock && (
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => onIntakeStock(product)}
                        title="Add / Intake Stock"
                      >
                        <i className="bi bi-plus-lg me-1"></i>Stock
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(product.id, product.productName)}
                        title="Delete Product"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
