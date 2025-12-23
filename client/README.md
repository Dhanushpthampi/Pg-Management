# GullyPG Frontend

React-based frontend application for the GullyPG management system.

## 🎯 Overview

The frontend is built with React 18 and Vite, providing a modern, responsive interface for managing PG accommodations. It features a component-based architecture with reusable UI elements and a clean design system.

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **Vite 6.0** - Fast build tool and dev server
- **PropTypes** - Runtime type checking

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── api/            # API configuration
│   │   └── axios.js    # Axios instance with base URL
│   │
│   ├── components/     # Reusable UI components
│   │   ├── BackButton.jsx      # Navigation back button
│   │   ├── FilterBar.jsx       # Filter component
│   │   ├── Header.jsx          # Top header bar
│   │   ├── PageHeader.jsx      # Page title with actions
│   │   ├── SearchBar.jsx       # Search input component
│   │   └── Sidebar.jsx         # Navigation sidebar
│   │
│   ├── layouts/        # Layout components
│   │   └── MainLayout.jsx      # Main app layout (Sidebar + Header + Content)
│   │
│   ├── pages/          # Page components
│   │   ├── bookings/
│   │   │   ├── Bookings.jsx          # Bookings list
│   │   │   ├── NewBooking.jsx        # Create booking
│   │   │   └── CheckIn.jsx           # 4-step check-in wizard
│   │   │
│   │   ├── checkout/
│   │   │   └── CheckoutNoticeManagement.jsx  # Checkout & notice page
│   │   │
│   │   ├── complaints/
│   │   │   ├── Complaints.jsx        # Complaints list
│   │   │   ├── NewComplaint.jsx      # Create complaint
│   │   │   └── ComplaintDetails.jsx  # Complaint details & timeline
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx         # Main dashboard
│   │   │
│   │   ├── invoices/
│   │   │   ├── Invoices.jsx          # Invoices list
│   │   │   ├── NewInvoice.jsx        # Create invoice
│   │   │   └── InvoiceView.jsx       # View & print invoice
│   │   │
│   │   ├── properties/
│   │   │   ├── Properties.jsx        # Properties list
│   │   │   ├── AddProperty.jsx       # Create property
│   │   │   ├── EditProperty.jsx      # Edit property
│   │   │   └── ManageProperty.jsx    # Manage hierarchy
│   │   │
│   │   ├── staff/
│   │   │   ├── Staff.jsx             # Staff list
│   │   │   ├── AddStaff.jsx          # Create staff
│   │   │   └── EditStaff.jsx         # Edit staff
│   │   │
│   │   └── tenants/
│   │       ├── Tenants.jsx           # Tenants list
│   │       ├── TenantDetails.jsx     # Tenant details
│   │       ├── Checkout.jsx          # Checkout list
│   │       ├── ProcessCheckout.jsx   # Process checkout
│   │       └── RaiseNotice.jsx       # Raise notice
│   │
│   ├── router/         # Routing configuration
│   │   └── AppRouter.jsx             # All route definitions
│   │
│   ├── index.css       # Global styles & CSS variables
│   ├── main.jsx        # Application entry point
│   └── App.jsx         # Root component
│
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

The frontend connects to the backend API. Update the base URL in `src/api/axios.js`:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});
```

## 🎨 Design System

### CSS Variables

Defined in `index.css`:

```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --bg-main: #f8fafc;
  --border-color: #e2e8f0;
  --radius: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
}
```

### Component Library

#### PageHeader
```jsx
<PageHeader 
  title="Page Title" 
  action={<button>Action</button>}
/>
```

#### SearchBar
```jsx
<SearchBar 
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="Search..."
/>
```

#### BackButton
```jsx
<BackButton />
```

### Styling Conventions

- **Global Styles**: `index.css` for CSS variables and base styles
- **Component Styles**: Inline `<style>` tags for component-specific styles
- **Utility Classes**: Defined in global CSS (`.btn`, `.badge`, `.data-table`, etc.)

## 📱 Key Features

### 1. Dashboard
- Real-time statistics cards
- Recent tenant activity
- Quick navigation

### 2. Property Management
- CRUD operations for properties
- Hierarchy management (Block → Floor → Room → Bed)
- Amenities and meal type selection
- Occupancy statistics

### 3. Tenant Management
- Complete tenant profiles
- KYC document management
- Status tracking
- Financial details

### 4. Check-In Wizard
4-step process:
1. Personal Details
2. Property Selection (Hierarchy)
3. Document Upload
4. Financial Details

### 5. Invoice System
- Create invoices with line items
- Automatic GST calculation
- Professional invoice template
- Print/Download functionality

### 6. Complaint Management
- Category-based complaints
- Priority levels
- Status tracking with timeline
- Staff assignment

### 7. Checkout & Notice
- Dual-tab interface (Raise Notice / Pending Checkouts)
- Search functionality
- Process checkout workflow

## 🔄 State Management

Currently using React's built-in state management:
- `useState` for local component state
- `useEffect` for side effects and data fetching
- Props for parent-child communication

## 🌐 Routing

Routes are defined in `src/router/AppRouter.jsx`:

```javascript
/                           → Dashboard
/properties                 → Properties list
/properties/new             → Add property
/properties/:id/edit        → Edit property
/properties/:id/manage      → Manage hierarchy
/tenants                    → Tenants list
/tenants/:id                → Tenant details
/checkin                    → Check-in wizard
/bookings                   → Bookings list
/bookings/new               → New booking
/staff                      → Staff list
/staff/new                  → Add staff
/staff/:id/edit             → Edit staff
/complaints                 → Complaints list
/complaints/new             → New complaint
/complaints/:id             → Complaint details
/invoices                   → Invoices list
/invoices/new               → Create invoice
/invoices/:id               → View invoice
/checkout-notice            → Checkout & notice management
/checkout/:id/process       → Process checkout
/notice/:id                 → Raise notice
```

## 📡 API Integration

All API calls use the configured Axios instance from `src/api/axios.js`:

```javascript
import api from "../../api/axios";

// GET request
const { data } = await api.get("/tenants");

// POST request
await api.post("/tenants", formData);

// PUT request
await api.put(`/tenants/${id}`, updateData);

// DELETE request
await api.delete(`/tenants/${id}`);
```

## 🎯 Component Patterns

### Data Fetching Pattern
```javascript
const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const { data } = await api.get("/endpoint");
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, []);
```

### Form Handling Pattern
```javascript
const [formData, setFormData] = useState({
  field1: "",
  field2: ""
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post("/endpoint", formData);
  navigate("/success");
};
```

## 🔧 Build Configuration

### Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing

### Utilities
- `axios` - HTTP client
- `lucide-react` - Icons
- `prop-types` - Type checking

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Code linting

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options
- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repo
- **Static Hosting**: Upload `dist/` folder

### Environment Variables
Create `.env` file:
```
VITE_API_URL=https://your-api-url.com/api
```

Update `axios.js`:
```javascript
baseURL: import.meta.env.VITE_API_URL
```

## 🐛 Debugging

### React DevTools
Install React DevTools browser extension for component inspection.

### Console Logging
All API errors are logged to console:
```javascript
catch (error) {
  console.error("Error:", error);
}
```

## 📝 Code Style

- Use functional components with hooks
- PropTypes for component props
- Consistent naming (camelCase for variables, PascalCase for components)
- Keep components focused and reusable
- Extract common logic into custom hooks

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established design system
3. Add PropTypes to new components
4. Test all CRUD operations
5. Ensure responsive design

---

**For backend documentation, see `/server/README.md`**
