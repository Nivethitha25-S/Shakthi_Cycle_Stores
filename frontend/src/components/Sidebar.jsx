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
        </div>

        <div className="pt-3 border-top border-secondary border-opacity-25 mt-3">
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
