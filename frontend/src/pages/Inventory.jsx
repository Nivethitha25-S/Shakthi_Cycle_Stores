import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import ProductTable from '../components/ProductTable';

function Inventory({ onNavigate, onIntakeStockDirect }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  
  const initialForm = {
    id: null,
    productName: '',
    category: 'Bicycles',
    brand: '',
    model: '',
    purchasePrice: '',
    sellingPrice: '',
    stockQuantity: '',
    minimumStock: '5',
    supplier: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = ['ALL', 'Bicycles', 'Accessories', 'Spare Parts', 'Tyres & Tubes', 'Lubricants & Care', 'Safety Gear', 'Cycle'];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.getAll();
      setProducts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.productName && p.productName.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.model && p.model.toLowerCase().includes(q)) ||
          (p.supplier && p.supplier.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedStatus !== 'ALL') {
      result = result.filter((p) => {
        const stock = p.stockQuantity ?? 0;
        const min = p.minimumStock ?? 5;
        if (selectedStatus === 'OUT_OF_STOCK') return stock === 0;
        if (selectedStatus === 'LOW_STOCK') return stock > 0 && stock <= min;
        if (selectedStatus === 'IN_STOCK') return stock > min;
        return true;
      });
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      productName: product.productName || '',
      category: product.category || 'Bicycles',
      brand: product.brand || '',
      model: product.model || '',
      purchasePrice: product.purchasePrice != null ? String(product.purchasePrice) : '',
      sellingPrice: product.sellingPrice != null ? String(product.sellingPrice) : '',
      stockQuantity: product.stockQuantity != null ? String(product.stockQuantity) : '0',
      minimumStock: product.minimumStock != null ? String(product.minimumStock) : '5',
      supplier: product.supplier || ''
    });
    setModalError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialForm);
    setModalError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');

    const payload = {
      productName: formData.productName.trim(),
      category: formData.category.trim(),
      brand: formData.brand.trim() || null,
      model: formData.model.trim() || null,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
      minimumStock: parseInt(formData.minimumStock, 10) || 5,
      supplier: formData.supplier.trim() || null
    };

    if (isNaN(payload.purchasePrice) || payload.purchasePrice < 0) {
      setModalError('Purchase price must be a valid positive number.');
      setModalLoading(false);
      return;
    }

    if (isNaN(payload.sellingPrice) || payload.sellingPrice < 0) {
      setModalError('Selling price must be a valid positive number.');
      setModalLoading(false);
      return;
    }

    try {
      if (isEditing && formData.id) {
        await productsApi.update(formData.id, payload);
        setSuccessMessage(`Product '${payload.productName}' updated successfully.`);
      } else {
        await productsApi.create(payload);
        setSuccessMessage(`Product '${payload.productName}' added to inventory successfully.`);
      }
      handleCloseModal();
      fetchProducts();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setModalError(err.message || 'Failed to save product.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete '${name}' (ID: #${id}) from inventory?`)) {
      try {
        await productsApi.delete(id);
        setSuccessMessage(`Product '${name}' removed successfully.`);
        fetchProducts();
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err) {
        setError(err.message || 'Failed to delete product.');
      }
    }
  };

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Inventory Management</h2>
          <p className="text-muted mb-0 small">
            Manage your cycle store items, accessories, stock intake, and pricing.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={fetchProducts}
            disabled={loading}
          >
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
            <span className="d-none d-sm-inline">Refresh</span>
          </button>

          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={handleOpenAdd}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between py-3 px-4 rounded-4 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>{error}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search products by name, brand, model, supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-light border"
                  type="button"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small fw-semibold text-nowrap">Category:</label>
              <select
                className="form-select bg-light"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small fw-semibold text-nowrap">Status:</label>
              <select
                className="form-select bg-light"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Count Info */}
      <div className="d-flex justify-content-between align-items-center mb-2 px-1">
        <small className="text-muted fw-semibold">
          Showing {filteredProducts.length} of {products.length} products
        </small>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteProduct}
        onIntakeStock={(p) => {
          if (onIntakeStockDirect) {
            onIntakeStockDirect(p);
          } else {
            onNavigate('stock-intake');
          }
        }}
      />

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3 px-4">
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>
                  {isEditing ? 'Edit Product Details' : 'Add New Inventory Product'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  {modalError && (
                    <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                      <i className="bi bi-exclamation-circle-fill me-1"></i>
                      {modalError}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-semibold text-secondary">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Hero Sprint Pro 26T"
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold text-secondary">Category *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Bicycles, Spares"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Hero, Shimano, Firefox"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Model / Variant</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Hardtail 27.5, Disc Edition"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Purchase Price (₹ Cost) *</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="0.00"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Selling Price (₹ MRP/Retail) *</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          placeholder="0.00"
                          value={formData.sellingPrice}
                          onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Initial Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="0"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-semibold text-secondary">Minimum Stock Alert Threshold *</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="5"
                        value={formData.minimumStock}
                        onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Supplier / Distributor</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., TI Cycles India Ltd, Apex Sports Gear"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light py-3 px-4">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={modalLoading}>
                    {modalLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      isEditing ? 'Save Changes' : 'Add Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
