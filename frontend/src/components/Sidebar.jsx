import React from 'react';
import logoImg from '../assets/logo.png';

function Sidebar({ activePage, onNavigate, onLogout, isMobileOpen, onCloseMobile }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'inventory', label: 'Inventory', icon: 'bi-box-seam' },
    { id: 'stock-intake', label: 'Stock Intake', icon: 'bi-box-arrow-in-down' },
    { id: 'new-sale', label: 'New Sale / Billing', icon: 'bi-receipt-cutoff' },
    { id: 'sales-history', label: 'Sales History', icon: 'bi-clock-history' },
    { id: 'analytics', label: 'Analytics', icon: 'bi-graph-up-arrow' },
  ];

  const handleItemClick = (pageId) => {
    onNavigate(pageId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onCloseMobile}
        ></div>
      )}

      <aside
        className={`sidebar bg-dark text-white p-3 d-flex flex-column justify-content-between ${
          isMobileOpen ? 'show-mobile' : ''
        }`}
        style={{
          width: '260px',
          minWidth: '260px',
          minHeight: 'calc(100vh - 60px)',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1045,
          backgroundColor: '#0b0f19'
        }}
      >
        <div>
          {/* Logo Header */}
          <div className="d-flex align-items-center gap-2 px-2 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
            <img
              src={logoImg}
              alt="Logo"
              height="42"
              className="rounded bg-white p-1 shadow-sm"
              style={{ objectFit: 'contain' }}
            />
            <div>
              <div className="fw-bold text-white fs-6 lh-1">Shakthi Cycles</div>
              <small className="text-secondary" style={{ fontSize: '0.68rem' }}>& AUTO ACCESSORIES</small>
            </div>
          </div>

          <div className="text-secondary text-uppercase fw-bold px-3 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
            Store Management
          </div>
          <ul className="nav nav-pills flex-column gap-1 mb-auto">
            {menuItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li className="nav-item" key={item.id}>
                  <button
                    type="button"
                    className={`nav-link w-100 text-start d-flex align-items-center gap-3 py-2 px-3 rounded-3 border-0 transition ${
                      isActive
                        ? 'active bg-primary text-white fw-semibold shadow-sm'
                        : 'text-light bg-transparent hover-light'
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <i className={`bi ${item.icon} fs-5 ${isActive ? 'text-white' : 'text-secondary'}`}></i>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 pt-2 border-top border-secondary border-opacity-25">
            <button
              type="button"
              className="nav-link w-100 text-start d-flex align-items-center gap-3 py-2 px-3 rounded-3 border-0 text-warning bg-transparent hover-light"
              onClick={() => handleItemClick('landing')}
            >
              <i className="bi bi-globe2 fs-5 text-warning"></i>
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-top border-secondary border-opacity-25 mt-3">
          <div className="p-2 bg-black bg-opacity-40 rounded-3 mb-3 text-center border border-secondary border-opacity-25">
            <small className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>Store Location</small>
            <strong className="text-light small d-block">Main Bazaar, City Center</strong>
            <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 mt-1" style={{ fontSize: '0.65rem' }}>
              Cycle & Auto Spares Hub
            </span>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 shadow-sm"
            onClick={onLogout}
            title="Sign out and return to landing page"
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
