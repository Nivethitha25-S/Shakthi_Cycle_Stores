import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';

function StockIntake({ selectedProductInitial, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [incomingQuantity, setIncomingQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorMessage('');
    try {
      const data = await productsApi.getAll();
      setProducts(data || []);
      if (selectedProductInitial?.id) {
        setSelectedProductId(String(selectedProductInitial.id));
      } else if (data && data.length > 0 && !selectedProductId) {
        setSelectedProductId(String(data[0].id));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load products list.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductInitial]);

  const selectedProduct = products.find((p) => String(p.id) === String(selectedProductId));
  const currentStock = selectedProduct?.stockQuantity ?? 0;
  const addQty = parseInt(incomingQuantity, 10) || 0;
  const newTotalStock = currentStock + (addQty > 0 ? addQty : 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      setErrorMessage('Please select a product to restock.');
      return;
    }

    const qty = parseInt(incomingQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setErrorMessage('Incoming quantity must be a positive number greater than 0.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedProduct = await productsApi.intakeStock(selectedProductId, qty, notes.trim());
      setSuccessMessage(
        `Successfully added ${qty} units to '${updatedProduct.productName}'. New stock level: ${updatedProduct.stockQuantity} units.`
      );
      setIncomingQuantity('');
      setNotes('');
      // Refresh list to show updated stock values
      fetchProducts();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update product stock.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Stock Intake & Replenishment</h2>
          <p className="text-muted mb-0 small">
            Record incoming supplier shipments and restock inventory directly into the database.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => onNavigate('inventory')}
        >
          <i className="bi bi-box-seam"></i>
          <span>View Inventory</span>
        </button>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm p-4 mb-4" role="alert">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-check-circle-fill text-success fs-3"></i>
            <div>
              <h6 className="fw-bold mb-1">Stock Added Successfully!</h6>
              <div>{successMessage}</div>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between py-3 px-4 rounded-4 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>{errorMessage}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={() => setErrorMessage('')}>
            Dismiss
          </button>
        </div>
      )}

      <div className="row g-4">
        {/* Intake Form */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-header bg-dark text-white py-3 px-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-box-arrow-in-down text-primary"></i>
                Incoming Shipment Form
              </h5>
            </div>

            <div className="card-body p-4 p-md-5">
              {loadingProducts ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-2 small">Loading products catalog...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-exclamation-circle fs-2 d-block mb-2"></i>
                  <h6>No Products in Catalog</h6>
                  <p className="small">Please add a product in Inventory before performing stock intake.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => onNavigate('inventory')}>
                    Go to Inventory
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label text-secondary small fw-semibold" htmlFor="selectProduct">
                      Select Target Product *
                    </label>
                    <select
                      id="selectProduct"
                      className="form-select form-select-lg"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      required
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.productName} — [Current Stock: {p.stockQuantity ?? 0}] ({p.category})
                        </option>
                      ))}
                    </select>
                    <small className="text-muted d-block mt-1">
                      Choose an existing catalog item to increase its inventory quantity.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary small fw-semibold" htmlFor="incomingQuantity">
                      Incoming Quantity (Units Received) *
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-plus-slash-minus"></i>
                      </span>
                      <input
                        type="number"
                        id="incomingQuantity"
                        min="1"
                        step="1"
                        className="form-control"
                        placeholder="e.g., 10"
                        value={incomingQuantity}
                        onChange={(e) => setIncomingQuantity(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary small fw-semibold" htmlFor="shipmentNotes">
                      Supplier / Shipment Notes (Optional)
                    </label>
                    <textarea
                      id="shipmentNotes"
                      className="form-control"
                      rows="3"
                      placeholder="e.g., Invoice #TIR-9801 from Hero Cycles Distributor, batch #2026"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Saving Stock Update...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle fs-5"></i>
                        <span>Confirm & Update Stock</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-calculator text-primary"></i>
              Stock Preview Summary
            </h5>

            {selectedProduct ? (
              <div>
                <div className="p-3 bg-light rounded-3 mb-4">
                  <span className="text-secondary small d-block">Selected Product</span>
                  <h6 className="fw-bold text-dark mb-1">{selectedProduct.productName}</h6>
                  <div className="d-flex gap-2">
                    <span className="badge bg-secondary-subtle text-secondary border">
                      {selectedProduct.category}
                    </span>
                    <span className="badge bg-light text-dark border">
                      ID: #{selectedProduct.id}
                    </span>
                  </div>
                </div>

                <div className="list-group list-group-flush mb-4">
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <span className="text-secondary">Current Stock in DB</span>
                    <strong className="fs-6 text-dark">{currentStock} units</strong>
                  </div>

                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 text-success">
                    <span className="fw-semibold">+ Incoming Shipment</span>
                    <strong className="fs-6">+{addQty} units</strong>
                  </div>

                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-primary bg-opacity-10 rounded-3 px-3 mt-2">
                    <span className="fw-bold text-primary">New Expected Stock</span>
                    <strong className="fs-4 fw-bold text-primary">{newTotalStock} units</strong>
                  </div>
                </div>

                <div className="alert alert-info py-2 px-3 small rounded-3 mb-0">
                  <i className="bi bi-info-circle me-1"></i>
                  Inventory stock is updated in real-time in your PostgreSQL database and will reflect across billing and dashboards immediately.
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-box fs-1 d-block mb-2 text-secondary"></i>
                <p className="small">Select a product to view the inventory preview.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockIntake;
