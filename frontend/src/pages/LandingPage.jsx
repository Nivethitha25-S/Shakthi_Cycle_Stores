import logoImg from '../assets/logo.png';

export default function LandingPage({ onGoToLogin, isLoggedIn = false }) {
  const categories = [
    {
      title: 'MTB & Gear Bicycles',
      desc: 'High performance mountain bikes, 21-speed geared cycles & alloy hardtails.',
      icon: 'bi-bicycle',
      badge: 'Hero • Hercules • Trek',
      color: 'primary'
    },
    {
      title: 'Genuine Auto & Cycle Spares',
      desc: 'Shimano gear sets, hydraulic disc brakes, chains, derailleurs & ball bearings.',
      icon: 'bi-gear-wide-connected',
      badge: '100% OEM Original',
      color: 'warning'
    },
    {
      title: 'Safety Gear & Accessories',
      desc: 'Aero shield helmets, USB rechargeable LED headlamps, heavy 5-digit cable locks.',
      icon: 'bi-shield-check',
      badge: 'Safety Certified',
      color: 'success'
    },
    {
      title: 'Professional Service Workshop',
      desc: 'Expert wheel truing, computerized gear tuning, hydraulic bleeding & complete overhaul.',
      icon: 'bi-tools',
      badge: 'Certified Mechanics',
      color: 'info'
    }
  ];

  const highlights = [
    { number: '1,500+', label: 'Cycles Sold & Delivered', icon: 'bi-patch-check-fill' },
    { number: '100%', label: 'Genuine Spares Guaranteed', icon: 'bi-shield-fill-check' },
    { number: '15 Min', label: 'Express Billing & Delivery', icon: 'bi-lightning-charge-fill' },
    { number: '4.9 ★', label: 'Customer Trust Rating', icon: 'bi-star-fill' }
  ];

  const testimonials = [
    {
      name: 'Karthik Subramanian',
      role: 'Daily Commuter & Cyclist',
      comment: 'Bought my 27.5T Roadeo from Shakthi Cycle Stores. Outstanding after-sales service, quick tune-ups, and genuine parts always available!',
      rating: 5
    },
    {
      name: 'Priya Sundaram',
      role: 'Parent',
      comment: 'Got my daughter her first kids cycle here. The staff helped us pick the perfect size and safety gear. Highly recommended!',
      rating: 5
    },
    {
      name: 'Rajesh Varma',
      role: 'Weekend Trail Rider',
      comment: 'Replaced my hydraulic disc brakes with Shimano original spares. Best prices in town and same-day fitting by skilled mechanics.',
      rating: 5
    }
  ];

  return (
    <div className="min-vh-100 bg-white text-dark d-flex flex-column">
      {/* Top Banner Notice */}
      <div className="bg-dark text-white py-1 px-3 text-center small border-bottom border-secondary border-opacity-25" style={{ backgroundColor: '#0b0f19' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <span className="text-secondary">
            <i className="bi bi-geo-alt-fill text-warning me-1"></i> Main Bazaar, City Center | <i className="bi bi-telephone-fill text-success ms-2 me-1"></i> +91 98765 43210
          </span>
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50">
            Open Mon - Sat: 9:00 AM - 9:30 PM
          </span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3 border-bottom">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-3 text-decoration-none" href="#home">
            <img
              src={logoImg}
              alt="Shakthi Cycle Stores And Autos"
              height="52"
              className="rounded shadow-sm"
            />
            <div>
              <span className="fw-bold fs-4 text-dark d-block lh-1">Shakthi Cycle Stores</span>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                CYCLE SHOP & AUTO ACCESSORIES
              </small>
            </div>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold gap-lg-2">
              <li className="nav-item">
                <a className="nav-link text-dark px-3" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary px-3" href="#categories">Products & Spares</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary px-3" href="#services">Workshop</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary px-3" href="#why-us">Why Choose Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary px-3" href="#contact">Contact</a>
              </li>
            </ul>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow"
                onClick={onGoToLogin}
              >
                <i className="bi bi-shield-lock-fill"></i> {isLoggedIn ? 'Return to Dashboard' : 'Admin / Billing Portal'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill mb-3 fw-semibold small border border-primary border-opacity-25">
                <span className="badge bg-primary rounded-circle p-1" style={{ width: '6px', height: '6px' }}></span>
                Official Store & Auto Center
              </div>
              <h1 className="display-4 fw-bolder text-dark mb-3 lh-tight">
                Your Trusted Hub for <span className="text-primary">Bicycles</span>, Genuine Spares & Autos
              </h1>
              <p className="lead text-secondary mb-4 fs-6">
                Explore an extensive collection of premium geared mountain bikes, city road runners, kids cycles, and authentic Shimano & auto replacement spares. Guaranteed quality and expert on-spot workshop services.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <button
                  className="btn btn-primary btn-lg rounded-pill px-4 py-3 fw-bold shadow-lg d-flex align-items-center gap-2"
                  onClick={onGoToLogin}
                >
                  <i className="bi bi-box-arrow-in-right"></i> {isLoggedIn ? 'Open Store Dashboard' : 'Open POS & Store Management'}
                </button>
                <a
                  className="btn btn-outline-dark btn-lg rounded-pill px-4 py-3 fw-semibold"
                  href="#categories"
                >
                  <i className="bi bi-grid-fill me-1"></i> Browse Catalog
                </a>
              </div>

              <div className="d-flex align-items-center gap-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small text-muted fw-medium">Authorized Dealer</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small text-muted fw-medium">Instant GST Invoice</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <span className="small text-muted fw-medium">Certified Mechanics</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div className="position-relative d-inline-block">
                <div
                  className="position-absolute top-50 start-50 translate-middle rounded-circle bg-primary bg-opacity-10"
                  style={{ width: '380px', height: '380px', filter: 'blur(50px)', zIndex: 0 }}
                ></div>
                <img
                  src={logoImg}
                  alt="Shakthi Cycle Stores"
                  className="img-fluid rounded-4 shadow-lg position-relative border border-white border-4"
                  style={{ maxHeight: '420px', zIndex: 1, backgroundColor: '#ffffff' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Metrics Bar */}
      <section className="bg-dark text-white py-4 shadow-sm" style={{ backgroundColor: '#0f172a' }}>
        <div className="container">
          <div className="row g-4 text-center">
            {highlights.map((h, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="d-flex flex-column align-items-center">
                  <i className={`bi ${h.icon} text-primary fs-2 mb-1`}></i>
                  <h3 className="fw-bold text-white mb-0">{h.number}</h3>
                  <small className="text-secondary">{h.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories & Product Showcase */}
      <section id="categories" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5" style={{ maxWidth: '650px' }}>
            <span className="text-primary fw-bold text-uppercase small letter-spacing-1">What We Offer</span>
            <h2 className="fw-bold text-dark mt-1">Explore Products & Services</h2>
            <p className="text-secondary small">
              From top brand mountain bikes to precision engineered spare parts, we have everything you need.
            </p>
          </div>

          <div className="row g-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card h-100 p-4 border-0 shadow-sm rounded-4 card-hover bg-light border-top border-4 border-primary">
                  <div className={`d-inline-flex p-3 rounded-4 bg-${cat.color} bg-opacity-10 text-${cat.color} mb-3`} style={{ width: 'fit-content' }}>
                    <i className={`bi ${cat.icon} fs-3`}></i>
                  </div>
                  <span className="badge bg-secondary bg-opacity-10 text-secondary border mb-2 align-self-start small">
                    {cat.badge}
                  </span>
                  <h5 className="fw-bold text-dark mb-2">{cat.title}</h5>
                  <p className="text-secondary small mb-0">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Workshop */}
      <section id="why-us" className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase small letter-spacing-1">Why Shakthi Cycle Stores?</span>
              <h2 className="display-6 fw-bold text-dark mt-1 mb-4">
                The Best Quality & Service Experience in Town
              </h2>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-primary text-white p-2 rounded-circle mt-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check2"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">100% Genuine Certified Spares</h6>
                    <p className="text-secondary small mb-0">Every gear, derailleur, chain, brake pad, and tube is sourced directly from certified manufacturers.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-primary text-white p-2 rounded-circle mt-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check2"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Master Workshop Mechanics</h6>
                    <p className="text-secondary small mb-0">Experienced technicians for cycle tune-ups, custom builds, gear calibration, and wheel truing.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-primary text-white p-2 rounded-circle mt-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check2"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Digital GST Billing & Warranty Support</h6>
                    <p className="text-secondary small mb-0">Instant computerized itemized invoicing with clear warranty coverage and payment flexibility.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white p-4 rounded-4 shadow-sm border">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-primary"></i> Store Operating Hours
                </h5>
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="fw-medium text-dark">Monday - Friday</span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">9:00 AM - 9:30 PM</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="fw-medium text-dark">Saturday</span>
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold">9:00 AM - 9:30 PM</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="fw-medium text-dark">Sunday</span>
                    <span className="badge bg-warning bg-opacity-10 text-warning fw-bold">10:00 AM - 8:00 PM</span>
                  </li>
                </ul>

                <div className="p-3 bg-light rounded-3 text-center">
                  <div className="text-dark fw-bold mb-1">Need Immediate Assistance?</div>
                  <div className="text-muted small mb-2">Call our sales & service desk directly</div>
                  <a href="tel:+919876543210" className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-bold">
                    <i className="bi bi-telephone-fill me-1"></i> +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <span className="text-primary fw-bold text-uppercase small letter-spacing-1">Reviews</span>
            <h2 className="fw-bold text-dark mt-1">What Riders Say About Us</h2>
          </div>

          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 p-4 border rounded-4 shadow-sm bg-light">
                  <div className="d-flex text-warning mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill me-1"></i>
                    ))}
                  </div>
                  <p className="text-secondary small fst-italic mb-3">"{t.comment}"</p>
                  <div className="mt-auto border-top pt-2">
                    <h6 className="fw-bold text-dark mb-0">{t.name}</h6>
                    <small className="text-muted">{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light border-top">
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase small">Visit Our Store</span>
              <h2 className="fw-bold text-dark mt-1 mb-3">Shakthi Cycle Stores And Autos</h2>
              <div className="text-secondary small mb-3">
                <div className="mb-2"><i className="bi bi-geo-alt text-primary me-2 fs-5"></i> 124, Grand Trunk Cycle Road, Main Bazaar, City Center</div>
                <div className="mb-2"><i className="bi bi-envelope text-primary me-2 fs-5"></i> support@shakthicycles.com</div>
                <div className="mb-2"><i className="bi bi-telephone text-primary me-2 fs-5"></i> +91 98765 43210 / +91 98765 43211</div>
              </div>
            </div>

            <div className="col-lg-6 text-lg-end">
              <div className="card p-4 border-0 shadow-sm rounded-4 bg-white text-start">
                <h5 className="fw-bold text-dark mb-2">Store Portal Access</h5>
                <p className="text-muted small mb-3">Store administrators can log in to manage inventory, record sales, and access reports.</p>
                <button
                  className="btn btn-primary rounded-pill py-2 px-4 fw-bold shadow-sm d-flex align-items-center gap-2 justify-content-center"
                  onClick={onGoToLogin}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Log In to Store Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 border-top border-secondary border-opacity-25" style={{ backgroundColor: '#0b0f19' }}>
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <img src={logoImg} alt="Logo" height="36" className="rounded" />
            <span className="fw-bold text-white">Shakthi Cycle Stores And Autos</span>
          </div>

          <div className="text-secondary small">
            © {new Date().getFullYear()} Shakthi Cycle Stores And Autos. All rights reserved.
          </div>

          <div>
            <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={onGoToLogin}>
              <i className="bi bi-lock me-1"></i> Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
