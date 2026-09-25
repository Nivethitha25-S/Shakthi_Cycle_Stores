function DashboardCard({ title, value, icon, color = 'primary', subtitle, loading = false, onClick }) {
  return (
    <div
      className={`card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      style={{
        borderLeft: `5px solid var(--bs-${color})`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      <div className="card-body p-4 d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-secondary text-uppercase fw-semibold mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
            {title}
          </h6>
          <h3 className="mb-0 fw-bold text-dark">
            {loading ? (
              <span className="spinner-border spinner-border-sm text-secondary" role="status"></span>
            ) : (
              value ?? 0
            )}
          </h3>
          {subtitle && (
            <small className="text-muted d-block mt-2" style={{ fontSize: '0.75rem' }}>
              {subtitle}
            </small>
          )}
        </div>

        <div
          className={`d-flex align-items-center justify-content-center rounded-4 bg-${color} bg-opacity-10 text-${color} p-3`}
          style={{ width: '60px', height: '60px' }}
        >
          <i className={`bi ${icon} fs-3`}></i>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
