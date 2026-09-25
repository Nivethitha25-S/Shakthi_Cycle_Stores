import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../services/api';

function Analytics({ onNavigate }) {
  const [period, setPeriod] = useState('monthly');
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async (selectedPeriod) => {
    setLoading(true);
    setError('');
    try {
      const data = await analyticsApi.getTopProducts(selectedPeriod, 10);
      setTopProducts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load sales analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const totalSoldUnits = topProducts.reduce((sum, p) => sum + (Number(p.quantitySold) || 0), 0);
  const totalTopRevenue = topProducts.reduce((sum, p) => sum + (Number(p.totalRevenue) || 0), 0);
  const maxQty = Math.max(...topProducts.map((p) => Number(p.quantitySold) || 0), 1);

  return (
    <div className="container-fluid p-3 p-lg-4">
      {/* Header & Period Selectors */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Sales & Product Analytics</h2>
          <p className="text-muted mb-0 small">
            Analyze top-performing bicycle models, spare parts, and revenue drivers for Shakthi Cycle Stores And Autos.
          </p>
        </div>

        {/* Daily, Weekly, Monthly Filter Buttons */}
        <div className="btn-group shadow-sm bg-white p-1 rounded-3" role="group">
          <button
            type="button"
            className={`btn btn-sm px-3 fw-semibold ${
              period === 'daily' ? 'btn-primary' : 'btn-light text-secondary'
            }`}
            onClick={() => handlePeriodChange('daily')}
          >
            <i className="bi bi-calendar-day me-1"></i>Daily
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 fw-semibold ${
              period === 'weekly' ? 'btn-primary' : 'btn-light text-secondary'
            }`}
            onClick={() => handlePeriodChange('weekly')}
          >
            <i className="bi bi-calendar-week me-1"></i>Weekly
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 fw-semibold ${
              period === 'monthly' ? 'btn-primary' : 'btn-light text-secondary'
            }`}
            onClick={() => handlePeriodChange('monthly')}
          >
            <i className="bi bi-calendar-month me-1"></i>Monthly
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
          <button className="btn btn-sm btn-outline-danger" onClick={() => fetchAnalytics(period)}>
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Highlights */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  {period.toUpperCase()} Top Sold Units
                </small>
                <h3 className="fw-bold text-dark mb-0 mt-1">{totalSoldUnits} units</h3>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">
                <i className="bi bi-bag-check-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  {period.toUpperCase()} Gross Sales Value
                </small>
                <h3 className="fw-bold text-success mb-0 mt-1">{formatCurrency(totalTopRevenue)}</h3>
              </div>
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-4">
                <i className="bi bi-cash-stack fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Active Analysis Filter
                </small>
                <h4 className="fw-bold text-dark mb-0 mt-1 text-capitalize">{period} Report</h4>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-4">
                <i className="bi bi-pie-chart-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Chart-Style Visualizer & Ranking Table */}
      <div className="row g-4">
        {/* Visual Progress Bar Breakdown */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <i className="bi bi-bar-chart-line-fill text-primary"></i>
              Volume Distribution ({period.toUpperCase()})
            </h5>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2 small">Aggregating product analytics...</p>
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-graph-down fs-1 text-secondary d-block mb-2"></i>
                <h6>No Sales Data for this Period</h6>
                <p className="small">Try switching between Daily, Weekly, and Monthly buttons.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {topProducts.map((p, index) => {
                  const percentage = Math.round(((p.quantitySold || 0) / maxQty) * 100);
                  const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger'];
                  const colorClass = colors[index % colors.length];

                  return (
                    <div key={p.productId || index}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <strong className="text-dark small me-2">{index + 1}. {p.productName}</strong>
                          <span className="badge bg-secondary-subtle text-dark border" style={{ fontSize: '0.7rem' }}>
                            {p.category}
                          </span>
                        </div>
                        <span className="fw-bold text-dark small">{p.quantitySold} units ({formatCurrency(p.totalRevenue)})</span>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className={`progress-bar ${colorClass} progress-bar-striped progress-bar-animated`}
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top Products Table */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
            <div className="card-header bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-trophy text-warning"></i>
                Top Selling Products Leaderboard
              </h5>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p className="small mb-0">No records found for the selected timeframe.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr style={{ fontSize: '0.82rem' }}>
                        <th scope="col" className="ps-4">Rank</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Category</th>
                        <th scope="col" className="text-center">Units Sold</th>
                        <th scope="col" className="text-end pe-4">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p, index) => (
                        <tr key={p.productId || index}>
                          <td className="ps-4">
                            <span
                              className={`badge rounded-circle p-2 fw-bold ${
                                index === 0
                                  ? 'bg-warning text-dark'
                                  : index === 1
                                  ? 'bg-secondary text-white'
                                  : index === 2
                                  ? 'bg-danger-subtle text-danger border'
                                  : 'bg-light text-dark border'
                              }`}
                              style={{ width: '30px', height: '30px' }}
                            >
                              #{index + 1}
                            </span>
                          </td>
                          <td>
                            <strong className="text-dark d-block">{p.productName}</strong>
                            <small className="text-muted">{p.brand || 'Standard'}</small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {p.category}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-primary px-3 py-1 fw-bold fs-6">
                              {p.quantitySold}
                            </span>
                          </td>
                          <td className="text-end pe-4 fw-bold text-dark">
                            {formatCurrency(p.totalRevenue)}
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
      </div>
    </div>
  );
}

export default Analytics;
