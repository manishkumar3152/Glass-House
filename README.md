# GlassHouse - Proforma Invoice Management Software (ERP)
## Production-Ready Full-Stack MERN Application

A professional, enterprise-grade **Proforma Invoice (PI) Management System** built with the **MERN Stack** (MongoDB, Express, React, Node.js) specifically tailored for architectural glass and toughened glass processing industries.

---

## 🌟 Key Highlights & Capabilities

- **Exact Two-Page PDF Generation**: Powered by **Puppeteer** with pixel-perfect HTML/CSS layouts that precisely match standard Indian glass processing proforma invoices (`Quote.v2.PI-26-27-8521.PDF`).
  - **Page 1**: Company header, customer billing and site delivery information, 11-column glass specification table (L, W, Qty, Unit, Act Area, Weight, Chrg Area, Rate, Per, Amount), processing charges table, financial breakdown (Insurance @ 2%, Document charges, GST, Round off), and amount in words.
  - **Page 2**: Complete 15 industry-standard terms & conditions, bank details for RTGS/NEFT, prepared by, checked by, and authorized signatory signatures.
- **Authoritative Calculation Engine**: Independent, decimal-safe monetary calculation services and unit converters matching the exact reference test case to the paisa.
- **Master Management**: Complete CRUD for Company Details, Customers, Glass Specifications, Glass Rates, Processing Charges, Tax Configurations, and Terms & Conditions.
- **Unique Financial-Year PI Sequencing**: Auto-generates unique sequence numbers formatted like `PI-26-27-8521`.
- **Snapshot Preservation**: Invoices capture complete immutable snapshots of company, customer, glass specifications, rates, and terms upon approval.
- **Modern ERP UI/UX**: Built with React, Tailwind CSS, Redux Toolkit, React Router, React Hook Form, and React Hot Toast.

---

## 📐 Technology Stack

### Backend
- **Node.js** & **Express.js** (Clean REST API architecture)
- **MongoDB** & **Mongoose** (Relational-style indexing and snapshots)
- **Puppeteer** (Headless Chromium PDF generation with fallback)
- **JWT Authentication** & **bcryptjs** (Role-based access control: Super Admin, Admin, Employee)
- **Express-Validator** (Strict schema request validation)
- **Helmet**, **CORS**, **Morgan**, and **Rate Limiting** (Production security)

### Frontend
- **React.js (v18)** & **Vite (v6)**
- **Tailwind CSS** (Clean ERP theme with blue & green accents)
- **Redux Toolkit** & **React Redux** (Async thunks, slice architecture)
- **React Router DOM (v7)** (Protected and role-based routes)
- **Axios** (With request token interceptors and centralized error handling)
- **React Icons** & **React Hot Toast**

---

## 📁 Project Architecture

```
GlassHouse/
├── Backend/
│   ├── config/             # DB & Environment configs
│   ├── models/             # Mongoose schemas (Invoice, Customer, Company, GlassSpecification, etc.)
│   ├── controllers/        # Express route handlers
│   ├── routes/             # REST API routes
│   ├── services/           # Business logic & PDF generation services
│   ├── calculators/        # Authoritative decimal-safe calculation engine
│   ├── constants/          # System units, statuses, FY configs
│   ├── middleware/         # Auth, validation, error handling
│   ├── validators/         # Input schema validation rules
│   ├── utils/              # ApiResponse, ApiError, currency & date formatters
│   ├── templates/invoice/  # Pixel-perfect HTML & CSS templates for PDF rendering
│   ├── scripts/            # Database seeders (seedAdmin.js, seedMasters.js)
│   ├── tests/              # Unit & End-to-end integration test suites
│   ├── uploads/invoices/   # Generated PDF storage directory
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # Redux Toolkit store configuration
│   │   ├── api/            # Axios API client modules
│   │   ├── redux/slices/   # Auth, Customer, Master, Invoice, Dashboard slices
│   │   ├── components/
│   │   │   ├── common/     # Reusable UI (Button, Input, Card, Modal, Badge, Loader)
│   │   │   ├── layout/     # Sidebar, Header, Main App Layout
│   │   │   └── invoice/    # 11-column table, processing table, summary, exact preview
│   │   ├── pages/
│   │   │   ├── auth/       # Login page
│   │   │   ├── dashboard/  # Analytics & metrics dashboard
│   │   │   ├── customers/  # Customer CRUD
│   │   │   ├── masters/    # Company, Glass Specs, Rates, Processing, Tax, Terms
│   │   │   └── invoices/   # List, Create, Edit, View, and Preview pages
│   │   ├── routes/         # Protected routes & AppRoutes
│   │   ├── hooks/          # Live calculation hook (useInvoiceCalculation)
│   │   ├── calculators/    # Frontend calculation engine mirror
│   │   ├── constants/      # App & API constants
│   │   ├── utils/          # Currency formatters, date formatters, number to words
│   │   └── styles/         # Two-page invoice styling (invoice.css)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🧮 Calculation Engine & Test Case Verification

The calculation engine was rigorously verified against the reference proforma invoice `Quote.v2.PI-26-27-8521.PDF`:

| Metric / Item | Reference Value | Engine Output | Status |
| :--- | :--- | :--- | :---: |
| **PI Number** | PI-26-27-8521 | `PI-26-27-8521` | Match |
| **Customer** | Ajay Glass House | `Ajay Glass House` | Match |
| **Total Quantity** | 8 NOS | `8 NOS` | Match |
| **Total Weight** | 113.16 kg | `113.16 kg` | Match |
| **Total Chargeable Area** | 7.621 Sqm | `7.621 Sqm` | Match |
| **Glass Total** | ₹5,906.29 | `₹5,906.29` | Match |
| **Processing Cost** | ₹90.00 | `₹90.00` | Match |
| **Total Cost** | ₹5,996.29 | `₹5,996.29` | Match |
| **Insurance @ 2%** | ₹119.93 | `₹119.93` | Match |
| **Document Charge** | ₹25.00 | `₹25.00` | Match |
| **Total Additional Charges** | ₹144.93 | `₹144.93` | Match |
| **Total Amount Before Tax** | ₹6,141.22 | `₹6,141.22` | Match |
| **IGST @ 18%** | ₹1,105.43 | `₹1,105.43` | Match |
| **Total Amount After Tax** | ₹7,246.65 | `₹7,246.65` | Match |
| **Rounded Off Amount** | ₹7,247.00 | `₹7,247.00` | Match |
| **Amount in Words** | Rupees Seven Thousand Two Hundred Forty Seven Only | Exact Match | Match |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **MongoDB** running locally on default port `27017` (or MongoDB Atlas connection string)
- **Google Chrome** or **Microsoft Edge** (for Puppeteer PDF generation)

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Seed Admin & Master records (includes sample reference invoice PI-26-27-8521)
npm run seed

# Run unit tests for calculations
npm test

# Start the Backend server (runs on http://localhost:5000)
npm run dev
# or
npm start
```

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start Vite Development Server (runs on http://localhost:5173)
npm run dev
```

---

## 🔑 Demo Login Credentials

- **Super Admin**:
  - Email: `admin@glasshouse.com`
  - Password: `password123`
- **Sales Executive**:
  - Email: `sales@glasshouse.com`
  - Password: `password123`

---

## 📄 PDF Generation Features

- **Direct Download**: `GET /api/invoices/:id/pdf`
- **Dynamic HTML Preview**: `GET /api/invoices/:id/preview-html`
- **Regenerate PDF**: `POST /api/invoices/:id/generate-pdf`
- Invoices can also be printed directly from the browser view with clean `@media print` stylesheets.

---

## 🛡️ License
Proprietary software developed for enterprise architectural glass processing management.
