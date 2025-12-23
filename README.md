# GullyPG - PG Management System

A comprehensive web-based management system for Paying Guest (PG) accommodations, built with React, Node.js, Express, and MongoDB.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Module Documentation](#module-documentation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

---

## 🎯 Overview

GullyPG is a full-stack application designed to streamline the management of PG accommodations. It handles everything from property management and tenant check-ins to invoicing, complaints, and staff management.

### Key Capabilities

- **Property Management**: Manage multiple properties with hierarchical structure (Property → Block → Floor → Room → Bed)
- **Tenant Management**: Complete tenant lifecycle from booking to check-in to checkout
- **Booking System**: Handle booking requests and convert them to check-ins
- **Invoice Management**: Generate and track invoices with GST calculations
- **Complaint Tracking**: Manage tenant complaints with status tracking and timeline
- **Staff Management**: Organize staff members across properties
- **Checkout & Notice**: Handle tenant exits and notice periods

---

## ✨ Features

### 1. **Dashboard**
- Real-time statistics (properties, tenants, bookings, complaints, revenue)
- Recent tenant activity
- Quick access to all modules

### 2. **Property Management**
- Add/Edit/Delete properties
- Hierarchical structure: Property → Block → Floor → Room → Bed
- Track amenities (Food, Internet, AC, Gym, etc.)
- Meal type preferences (Veg/Non-Veg)
- View occupancy statistics (floors, beds, occupied count)

### 3. **Tenant Management**
- Complete tenant profiles with KYC documents
- Property and room assignment
- Status tracking (Active, On Notice, Vacated)
- Tenant details with financial information

### 4. **Booking System**
- Create new bookings
- Track booking status (Booked, Checked-in, Cancelled)
- Convert bookings to check-ins
- Bed availability management

### 5. **Check-In Process**
- 4-step wizard for tenant check-in
- Property hierarchy selection
- Document upload (ID proof, address proof)
- Financial details (rent, deposit)
- Automatic bed status update

### 6. **Invoice Management**
- Create invoices with line items
- Automatic GST calculation (CGST 9% + SGST 9%)
- Professional invoice template
- Print/Download as PDF
- Track payment status

### 7. **Complaint Management**
- Raise complaints by category (Plumbing, Electrical, Food, etc.)
- Priority levels (Low, Medium, High)
- Status tracking (Open, In Progress, Resolved)
- Timeline with comments
- Staff assignment

### 8. **Staff Management**
- Add/Edit staff members
- Role-based organization (Admin, Manager, Staff, Vendor)
- Property assignment
- Contact information management

### 9. **Checkout & Notice Management**
- Raise notice for tenants
- Track pending checkouts
- Process final checkout
- Deposit refund management

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Pages     │  │ Components │  │   Router   │            │
│  │            │  │            │  │            │            │
│  │ Dashboard  │  │ PageHeader │  │ AppRouter  │            │
│  │ Properties │  │ SearchBar  │  │            │            │
│  │ Tenants    │  │ Sidebar    │  │            │            │
│  │ Bookings   │  │ BackButton │  │            │            │
│  │ Invoices   │  │            │  │            │            │
│  │ Complaints │  │            │  │            │            │
│  │ Staff      │  │            │  │            │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                         │                                    │
│                    Axios API                                 │
└─────────────────────────┼───────────────────────────────────┘
                          │
                     HTTP/REST
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    SERVER (Node.js/Express)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Routes   │  │Controllers │  │   Models   │            │
│  │            │  │            │  │            │            │
│  │ /properties│→ │ property   │→ │ Property   │            │
│  │ /tenants   │→ │ tenant     │→ │ Tenant     │            │
│  │ /bookings  │→ │ booking    │→ │ Booking    │            │
│  │ /invoices  │→ │ invoice    │→ │ Invoice    │            │
│  │ /complaints│→ │ complaint  │→ │ Complaint  │            │
│  │ /staff     │→ │ staff      │→ │ Staff      │            │
│  │ /hierarchy │→ │ hierarchy  │→ │ Block/Floor│            │
│  │ /dashboard │→ │ dashboard  │→ │ Room/Bed   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                         │                                    │
│                    Mongoose ODM                              │
└─────────────────────────┼───────────────────────────────────┘
                          │
                     MongoDB Atlas
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                   DATABASE (MongoDB)                         │
│                                                              │
│  Collections:                                                │
│  • properties  • tenants    • bookings  • invoices          │
│  • complaints  • staff      • blocks    • floors            │
│  • rooms       • beds                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

---

## 📁 Project Structure

```
gullyPG/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── api/              # API configuration
│   │   │   └── axios.js      # Axios instance with base URL
│   │   ├── components/       # Reusable components
│   │   │   ├── BackButton.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── layouts/          # Layout components
│   │   │   └── MainLayout.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── bookings/
│   │   │   ├── checkout/
│   │   │   ├── complaints/
│   │   │   ├── dashboard/
│   │   │   ├── invoices/
│   │   │   ├── properties/
│   │   │   ├── staff/
│   │   │   └── tenants/
│   │   ├── router/           # Routing configuration
│   │   │   └── AppRouter.jsx
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   └── package.json
│
└── server/                    # Backend Node.js application
    ├── src/
    │   ├── config/           # Configuration files
    │   │   └── db.js         # MongoDB connection
    │   ├── controllers/      # Request handlers
    │   │   ├── bookingController.js
    │   │   ├── checkoutController.js
    │   │   ├── complaintController.js
    │   │   ├── dashboardController.js
    │   │   ├── hierarchyController.js
    │   │   ├── invoiceController.js
    │   │   ├── propertyController.js
    │   │   ├── staffController.js
    │   │   └── tenantController.js
    │   ├── models/           # Mongoose schemas
    │   │   ├── Bed.js
    │   │   ├── Block.js
    │   │   ├── Booking.js
    │   │   ├── Complaint.js
    │   │   ├── Floor.js
    │   │   ├── Invoice.js
    │   │   ├── Property.js
    │   │   ├── Room.js
    │   │   ├── Staff.js
    │   │   └── Tenant.js
    │   └── routes/           # API routes
    │       ├── bookingRoutes.js
    │       ├── checkoutRoutes.js
    │       ├── complaintRoutes.js
    │       ├── dashboardRoutes.js
    │       ├── hierarchyRoutes.js
    │       ├── invoiceRoutes.js
    │       ├── propertyRoutes.js
    │       ├── staffRoutes.js
    │       └── tenantRoutes.js
    ├── uploads/              # File uploads directory
    ├── server.js             # Entry point
    ├── .env                  # Environment variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd gullyPG
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "PORT=5000" >> .env

# Start server
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Start development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📚 Module Documentation

### Property Hierarchy

The system uses a 5-level hierarchy:

```
Property (PG Building)
  └── Block (Building Section)
      └── Floor (Floor Level)
          └── Room (Individual Room)
              └── Bed (Bed in Room)
```

**Example**: 
- Property: "GullyPG Nagarbhavi"
- Block: "Block A"
- Floor: "3rd Floor"
- Room: "305"
- Bed: "B2"

### Tenant Lifecycle

```
Booking → Check-In → Active → On Notice → Checkout → Vacated
```

1. **Booking**: Initial reservation
2. **Check-In**: Complete onboarding with documents
3. **Active**: Currently residing
4. **On Notice**: Notice period given
5. **Checkout**: Exit process
6. **Vacated**: Completed exit

### Invoice Generation

Invoices are generated with:
- Line items (Rent, Maintenance, Electricity, etc.)
- Subtotal calculation
- GST (CGST 9% + SGST 9%)
- Total payable amount
- Due date (5 days from creation)

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Properties
- `GET /properties` - Get all properties
- `GET /properties/stats` - Get properties with statistics
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

#### Tenants
- `GET /tenants` - Get all tenants
- `GET /tenants/:id` - Get tenant by ID
- `POST /tenants` - Create tenant (Check-in)
- `PUT /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant

#### Bookings
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `PUT /bookings/:id/cancel` - Cancel booking

#### Invoices
- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get invoice by ID
- `POST /invoices` - Create invoice
- `PUT /invoices/:id` - Update invoice

#### Complaints
- `GET /complaints` - Get all complaints
- `GET /complaints/:id` - Get complaint by ID
- `POST /complaints` - Create complaint
- `PUT /complaints/:id` - Update complaint

#### Hierarchy
- `GET /hierarchy/properties/:id/hierarchy` - Get full property hierarchy
- `POST /hierarchy/blocks` - Create block
- `POST /hierarchy/floors` - Create floor
- `POST /hierarchy/rooms` - Create room
- `POST /hierarchy/beds` - Create bed
- `POST /hierarchy/beds/bulk` - Create multiple beds

#### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

---

## 🗄️ Database Schema

### Key Collections

**Property**
```javascript
{
  name: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  amenities: [String],
  mealTypes: [String],
  contactPerson: String,
  contactPhone: String,
  contactEmail: String
}
```

**Tenant**
```javascript
{
  name: String,
  email: String,
  phone: String,
  property: ObjectId (ref: Property),
  block: ObjectId (ref: Block),
  floor: ObjectId (ref: Floor),
  room: ObjectId (ref: Room),
  bed: ObjectId (ref: Bed),
  rentAmount: Number,
  depositAmount: Number,
  status: Enum ['active', 'on_notice', 'vacated']
}
```

**Invoice**
```javascript
{
  tenant: ObjectId (ref: Tenant),
  property: ObjectId (ref: Property),
  month: String,
  year: Number,
  items: [{
    description: String,
    amount: Number
  }],
  subtotal: Number,
  cgst: Number,
  sgst: Number,
  totalAmount: Number,
  status: Enum ['pending', 'paid', 'overdue']
}
```

---

## 🎨 Design System

### Color Palette
- Primary: `#2563eb` (Blue)
- Secondary: `#64748b` (Slate)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#ef4444` (Red)

### Components
- **PageHeader**: Consistent page titles with action buttons
- **SearchBar**: Reusable search component
- **Sidebar**: Navigation menu
- **BackButton**: Navigation back button
- **Badges**: Status indicators
 