import React, { useState, useEffect } from 'react';
import { productsApi, salesApi } from '../services/api';

function NewSale({ onSaleSuccess, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Cart Items
  const [cartItems, setCartItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Customer & Bill Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [discount, setDiscount] = useState(0);

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productsApi.getAll();
      setProducts(data || []);
      if (data && data.length > 0) {
        setSelectedProductId(String(data[0].id));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch products for billing.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Add Item to Cart
  const handleAddToCart = () => {
    setErrorMessage('');
    if (!selectedProductId) {
      setErrorMessage('Please select a product.');
      return;
    }

    const product = products.find((p) => String(p.id) === String(selectedProductId));
    if (!product) {
      setErrorMessage('Selected product not found.');
      return;
    }

    const qty = parseInt(selectedQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setErrorMessage('Quantity must be greater than zero.');
      return;
    }

    const availableStock = product.stockQuantity ?? 0;
    const existingCartItem = cartItems.find((item) => item.productId === product.id);
    const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
    const totalRequestedQty = currentCartQty + qty;

    if (totalRequestedQty > availableStock) {
      setErrorMessage(
        `Insufficient stock for '${product.productName}'. Available: ${availableStock}, already in cart: ${currentCartQty}.`
      );
      return;
    }

    if (existingCartItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: totalRequestedQty,
                totalPrice: product.sellingPrice * totalRequestedQty
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          productName: product.productName,
          category: product.category,
          brand: product.brand,
          unitPrice: product.sellingPrice,
          availableStock: availableStock,
          quantity: qty,
          totalPrice: product.sellingPrice * qty
        }
      ]);
    }

    setSelectedQuantity(1);
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (productId, newQty) => {
    setErrorMessage('');
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) return;

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (qty > (product.stockQuantity ?? 0)) {
      setErrorMessage(`Cannot exceed available stock of ${product.stockQuantity} for '${product.productName}'.`);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: qty,
              totalPrice: item.unitPrice * qty
            }
          : item
      )
    );
  };

  // Calculations Preview
  const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const discountAmount = Math.max(0, parseFloat(discount) || 0);
  const estimatedTotal = Math.max(0, subtotal - discountAmount);

  // Submit Sale to Backend
  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Please add at least one product to the invoice cart.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter the customer name.');
      return;
    }

    if (discountAmount > subtotal) {
      setErrorMessage(`Discount (₹${discountAmount}) cannot exceed subtotal (₹${subtotal}).`);
      return;
    }

    setSubmitting(true);

    const salePayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || null,
      paymentMethod: paymentMethod,
      discount: discountAmount,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    try {
      const createdSale = await salesApi.create(salePayload);
      if (onSaleSuccess) {
        onSaleSuccess(createdSale);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process sale transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentSelectedProduct = products.find((p) => String(p.id) === String(selectedProductId));

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">New Sale & Billing POS</h2>
          <p className="text-muted mb-0 small">
            Generate GST-ready retail invoices for Shakthi Cycle Stores And Autos.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => onNavigate('sales-history')}
        >
          <i className="bi bi-clock-history"></i>
          <span>Sales History</span>
        </button>
      </div>

      {/* Error Alert */}
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
        {/* Left Side: Product Selector & Cart */}
        <div className="col-12 col-lg-7">
          {/* Item Selector Box */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-cart-plus text-primary"></i>
              Add Items to Bill
            </h5>

            {loadingProducts ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary"></div>
                <span className="ms-2 text-muted small">Loading catalog...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="alert alert-warning small mb-0">
                No products found in inventory. Please add products in Inventory first.
              </div>
            ) : (
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Select Product</label>
                  <select
                    className="form-select form-select-lg"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    {products.map((p) => {
                      const isOutOfStock = (p.stockQuantity ?? 0) <= 0;
                      return (
                        <option key={p.id} value={p.id} disabled={isOutOfStock}>
                          {p.productName} — {formatCurrency(p.sellingPrice)} {isOutOfStock ? '(OUT OF STOCK)' : `[Stock: ${p.stockQuantity}]`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label small fw-semibold text-secondary">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={currentSelectedProduct?.stockQuantity || 1}
                    className="form-control form-control-lg text-center"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                </div>

                <div className="col-6 col-md-3">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart}
                    disabled={!currentSelectedProduct || (currentSelectedProduct.stockQuantity ?? 0) <= 0}
                  >
                    <i className="bi bi-plus-lg"></i>
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-header bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-bag-check text-primary"></i>
                Invoice Cart Items ({cartItems.length})
              </h6>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm py-0 px-2"
                  onClick={() => setCartItems([])}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="card-body p-0">
              {cartItems.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-cart-x fs-1 text-secondary d-block mb-2"></i>
                  <p className="mb-0 fw-semibold">Your billing cart is empty</p>
                  <small>Select products above and click "Add Item" to construct the invoice.</small>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr style={{ fontSize: '0.82rem' }}>
                        <th scope="col" className="ps-4">Product</th>
                        <th scope="col" className="text-center" style={{ width: '130px' }}>Quantity</th>
                        <th scope="col" className="text-end">Unit Price</th>
                        <th scope="col" className="text-end">Line Total</th>
                        <th scope="col" className="text-center pe-4" style={{ width: '50px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.productId}>
                          <td className="ps-4">
                            <strong className="text-dark d-block">{item.productName}</strong>
                            <small className="text-muted">{item.category} &bull; {item.brand || 'Standard'}</small>
                          </td>
                          <td className="text-center">
                            <input
                              type="number"
                              min="1"
                              max={item.availableStock}
                              className="form-control form-control-sm text-center fw-bold"
                              value={item.quantity}
                              onChange={(e) => handleUpdateCartQuantity(item.productId, e.target.value)}
                            />
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                              Avail: {item.availableStock}
                            </small>
                          </td>
                          <td className="text-end fw-medium text-dark">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            {formatCurrency(item.totalPrice)}
                          </td>
                          <td className="text-center pe-4">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger border-0 p-1"
                              onClick={() => handleRemoveItem(item.productId)}
                              title="Remove item"
                            >
                              <i className="bi bi-trash fs-6"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Customer Details & Checkout Box */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-person-check text-primary"></i>
              Customer & Payment Details
            </h5>

            <form onSubmit={handleCheckout}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary" htmlFor="custName">
                  Customer Name *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                  <input
                    type="text"
                    id="custName"
                    className="form-control"
                    placeholder="Enter customer full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary" htmlFor="custPhone">
                  Customer Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                  <input
                    type="tel"
                    id="custPhone"
                    className="form-control"
                    placeholder="e.g., 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Payment Method</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold text-secondary">Discount (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      placeholder="0.00"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="p-3 bg-light rounded-3 my-4">
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Subtotal:</span>
                  <span className="fw-semibold text-dark">{formatCurrency(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between text-danger mb-2">
                  <span>Discount:</span>
                  <span className="fw-semibold">- {formatCurrency(discountAmount)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center pt-1">
                  <strong className="fs-5 text-dark">Final Amount:</strong>
                  <strong className="fs-3 text-primary">{formatCurrency(estimatedTotal)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg w-100 py-3 fw-bold rounded-3 shadow d-flex align-items-center justify-content-center gap-2"
                disabled={submitting || cartItems.length === 0}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Generating Official Invoice...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-printer-fill fs-5"></i>
                    <span>Generate & Print Invoice</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSale;
