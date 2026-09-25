# 🚴‍♂️ Shakthi Cycle Stores - Cycle Shop & Auto Accessories Management System

A comprehensive Full-Stack Point of Sale (POS), Inventory, Stock Intake, and Billing Management System designed specifically for **Shakthi Cycle Stores - Cycle Shop & Auto Accessories**.

---

## 🌟 Key Features

### 🛍️ Store Front & Customer Landing Page
- Modern, responsive landing page showcasing cycle models, genuine auto spares, and workshop services.
- Quick navigation to store opening hours, contact details, and location.
- Direct secure entry portal for store administrators.

### 📊 Dashboard & Real-Time Analytics
- **Live Business Metrics**: Today's sales, total monthly revenue, low-stock inventory alerts, and top-performing products.
- Interactive category-wise revenue distribution charts and historical sales trends.

### 📦 Inventory & Stock Management
- Complete cycle and auto accessories catalog with SKU tracking, category filtering, and real-time stock levels.
- Automated low stock warnings and fast restock action triggers.
- Multi-category support: MTB Bicycles, City Cycles, Spares (Shimano, Derailleurs, Chains), Accessories, and Tyres.

### 📥 Stock Intake / Restocking
- Record incoming supplier shipments with batch entries, cost pricing, selling pricing, and supplier notes.
- Instant inventory balance updates upon submission.

### 🧾 Point of Sale (POS) & Automated Billing
- Fast cashier interface to search products, adjust quantities, apply discounts, and select payment methods (Cash, UPI, Card).
- Instant printable computerized GST tax invoices with itemized totals, store branding, and terms.

### 📜 Sales History & Invoice Archives
- Searchable transaction history with date filters and customer details.
- Reprint and preview past invoices on-demand.

### 🔐 Authentication & Session Flow
- Role-based administrative authentication.
- Seamless logout flow that gracefully returns users to the public landing page.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **UI & Styling**: Bootstrap 5 + Bootstrap Icons
- **HTTP Client**: Axios
- **State & Storage**: LocalStorage Session & Reactive State

### Backend
- **Framework**: Java 17+ / Spring Boot 3
- **Database**: PostgreSQL (Supabase cloud / Local PostgreSQL)
- **ORM / Persistence**: Spring Data JPA / Hibernate
- **REST APIs**: JSON RESTful endpoints with CORS configuration

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Java JDK** (v17 or higher) & **Maven**
- **PostgreSQL Database** (e.g. Supabase or local instance)

---

### 2. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Configure environment variables by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL database credentials:
   ```env
   DB_URL=jdbc:postgresql://<HOST>:5432/<DATABASE>?sslmode=require
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   PORT=8080
   ```

3. Build and run the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
   The backend server will start on `http://localhost:8080`.

---

### 3. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will open at `http://localhost:5173`.

---

## 📄 License & Attribution

Developed for **Shakthi Cycle Stores - Cycle Shop & Auto Accessories**. All rights reserved.
