import logoImg from '../assets/logo.png';

function Navbar({ user, onLogout, onToggleSidebar }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm px-3 py-2" style={{ backgroundColor: '#0f172a' }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-light d-lg-none p-1 px-2 border-0"
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          
          <div className="d-flex align-items-center gap-2">
            <img
              src={logoImg}
              alt="Shakthi Cycle Stores"
              height="40"
              className="rounded bg-white p-1 shadow-sm"
              style={{ objectFit: 'contain' }}
            />
            <div>
              <h1 className="navbar-brand mb-0 fw-bold fs-5 text-white tracking-wide">
                Shakthi Cycle Stores
              </h1>
              <small className="text-secondary d-none d-sm-block" style={{ fontSize: '0.72rem' }}>
                CYCLE SHOP & AUTO ACCESSORIES - Store Management
              </small>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-md-flex flex-column text-end">
            <span className="text-white fw-semibold small">
              {user?.username || 'Administrator'}
            </span>
            <span className="text-success small fw-medium" style={{ fontSize: '0.7rem' }}>
              <i className="bi bi-shield-check me-1"></i>Admin Verified
            </span>
          </div>
          
          <div className="dropdown">
            <button
              className="btn btn-danger btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm"
              type="button"
              onClick={onLogout}
              title="Sign out of system and go to landing page"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
