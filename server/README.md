# GullyPG Backend

Node.js/Express backend API for the GullyPG management system.

## 🎯 Overview

RESTful API built with Express.js and MongoDB, providing comprehensive endpoints for managing PG accommodations, tenants, bookings, invoices, complaints, and staff.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js 4.21** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.9** - MongoDB ODM
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Nodemon** - Development auto-reload

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection setup
│   │
│   ├── controllers/                 # Request handlers
│   │   ├── bookingController.js     # Booking CRUD operations
│   │   ├── checkoutController.js    # Checkout & notice logic
│   │   ├── complaintController.js   # Complaint management
│   │   ├── dashboardController.js   # Dashboard statistics
│   │   ├── hierarchyController.js   # Property hierarchy (Block/Floor/Room/Bed)
│   │   ├── invoiceController.js     # Invoice generation & management
│   │   ├── propertyController.js    # Property CRUD + statistics
│   │   ├── staffController.js       # Staff management
│   │   └── tenantController.js      # Tenant lifecycle management
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── Bed.js                   # Bed schema
│   │   ├── Block.js                 # Block schema
│   │   ├── Booking.js               # Booking schema
│   │   ├── Complaint.js             # Complaint with timeline
│   │   ├── Floor.js                 # Floor schema
│   │   ├── Invoice.js               # Invoice with GST
│   │   ├── Property.js              # Property with amenities
│   │   ├── Room.js                  # Room schema
│   │   ├── Staff.js                 # Staff schema
│   │   └── Tenant.js                # Tenant with KYC
│   │
│   └── routes/                      # API route definitions
│       ├── bookingRoutes.js         # /api/bookings
│       ├── checkoutRoutes.js        # /api/checkouts
│       ├── complaintRoutes.js       # /api/complaints
│       ├── dashboardRoutes.js       # /api/dashboard
│       ├── hierarchyRoutes.js       # /api/hierarchy
│       ├── invoiceRoutes.js         # /api/invoices
│       ├── propertyRoutes.js        # /api/properties
│       ├── staffRoutes.js           # /api/staff
│       └── tenantRoutes.js          # /api/tenants
│
├── uploads/                         # File upload directory
├── server.js                        # Application entry point
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
└── package.json                     # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
touch .env
```

### Environment Variables

Create `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gullypg?retryWrites=true&w=majority

# Server Port
PORT=5000

# Optional: JWT Secret (for future authentication)
JWT_SECRET=your_jwt_secret_key
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

### 🏢 Properties

#### Get All Properties
```http
GET /api/properties
Query: ?city=Bangalore&status=active&search=term
```

#### Get Properties with Statistics
```http
GET /api/properties/stats
Response: Properties with floor count, bed count, occupied count
```

#### Get Property by ID
```http
GET /api/properties/:id
```

#### Create Property
```http
POST /api/properties
Body: {
  name, address, city, state, pincode,
  amenities: [], mealTypes: [],
  contactPerson, contactPhone, contactEmail
}
```

#### Update Property
```http
PUT /api/properties/:id
```

#### Delete Property (Soft Delete)
```http
DELETE /api/properties/:id
Sets status to 'inactive'
```

---

### 👥 Tenants

#### Get All Tenants
```http
GET /api/tenants
Query: ?property=id&status=active&search=term
Populates: property, room, bed
```

#### Get Tenant by ID
```http
GET /api/tenants/:id
Populates: property, block, floor, room, bed
```

#### Create Tenant (Check-In)
```http
POST /api/tenants
Content-Type: multipart/form-data
Body: FormData with tenant details + files (idProof, addressProof)
Transaction: Updates bed status to 'occupied'
```

#### Update Tenant
```http
PUT /api/tenants/:id
```

#### Delete Tenant
```http
DELETE /api/tenants/:id
```

---

### 📅 Bookings

#### Get All Bookings
```http
GET /api/bookings
Populates: property, bed
```

#### Create Booking
```http
POST /api/bookings
Body: { name, phone, email, gender, property, joiningDate, amount }
Updates bed status to 'booked' if bed selected
```

#### Update Booking
```http
PUT /api/bookings/:id
```

#### Cancel Booking
```http
PUT /api/bookings/:id/cancel
Frees up the bed (status → 'available')
```

---

### 🏗️ Hierarchy

#### Get Full Property Hierarchy
```http
GET /api/hierarchy/properties/:id/hierarchy
Returns: Property → Blocks → Floors → Rooms → Beds (nested)
```

#### Create Block
```http
POST /api/hierarchy/blocks
Body: { name, property }
```

#### Get Blocks by Property
```http
GET /api/hierarchy/properties/:propertyId/blocks
```

#### Create Floor
```http
POST /api/hierarchy/floors
Body: { name, block, property }
```

#### Get Floors by Block
```http
GET /api/hierarchy/blocks/:blockId/floors
```

#### Create Room
```http
POST /api/hierarchy/rooms
Body: { number, type, rent, deposit, floor, block, property }
```

#### Get Rooms by Floor
```http
GET /api/hierarchy/floors/:floorId/rooms
Includes: beds for each room
```

#### Create Bed
```http
POST /api/hierarchy/beds
Body: { number, room, floor, block, property }
```

#### Create Bulk Beds
```http
POST /api/hierarchy/beds/bulk
Body: { roomId, count, startNumber }
Creates multiple beds at once
```

#### Update Bed Status
```http
PUT /api/hierarchy/beds/:id/status
Body: { status: 'available' | 'occupied' | 'booked' | 'notice' }
```

---

### 💰 Invoices

#### Get All Invoices
```http
GET /api/invoices
Populates: tenant, property
```

#### Get Invoice by ID
```http
GET /api/invoices/:id
Populates: tenant, property
```

#### Create Invoice
```http
POST /api/invoices
Body: {
  tenant, property, month, year,
  items: [{ description, amount }],
  subtotal, cgst, sgst, totalAmount,
  status: 'pending'
}
```

#### Update Invoice
```http
PUT /api/invoices/:id
```

---

### 🔧 Complaints

#### Get All Complaints
```http
GET /api/complaints
Query: ?status=open&category=plumbing
Populates: property, room, bed, raisedBy, assignedTo
```

#### Get Complaint by ID
```http
GET /api/complaints/:id
Populates: property, room, bed, raisedBy, assignedTo
```

#### Create Complaint
```http
POST /api/complaints
Body: {
  title, description, category, priority,
  property, room, bed, raisedBy
}
```

#### Update Complaint
```http
PUT /api/complaints/:id
Body: { status, assignedTo, timeline }
Timeline: [{ status, comment, updatedBy, timestamp }]
```

---

### 👔 Staff

#### Get All Staff
```http
GET /api/staff
Populates: property (if assigned)
```

#### Get Staff by ID
```http
GET /api/staff/:id
```

#### Create Staff
```http
POST /api/staff
Body: { name, email, phone, role, property }
```

#### Update Staff
```http
PUT /api/staff/:id
```

#### Delete Staff
```http
DELETE /api/staff/:id
```

---

### 🚪 Checkout

#### Raise Notice
```http
POST /api/checkouts/notice
Body: { tenantId, noticeDate, vacatingDate }
Updates tenant status to 'on_notice'
```

#### Finalize Checkout
```http
POST /api/checkouts/finalize
Body: { tenantId, exitDate, refundAmount, damageCharges }
Transaction: Updates tenant status to 'vacated', frees bed
```

---

### 📊 Dashboard

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Response: {
  stats: {
    properties, tenants, bookings, complaints, revenue
  },
  recentTenants: [...]
}
```

---

## 🗄️ Database Schema

### Property
```javascript
{
  name: String (required),
  address: String (required),
  city: String (required),
  state: String (required),
  pincode: String (required),
  amenities: [String],
  mealTypes: [String],
  status: Enum ['active', 'inactive'],
  contactPerson: String,
  contactPhone: String,
  contactEmail: String,
  timestamps: true
}
```

### Tenant
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  gender: Enum ['male', 'female', 'other'],
  
  // Assignment
  property: ObjectId → Property (required),
  block: ObjectId → Block,
  floor: ObjectId → Floor,
  room: ObjectId → Room,
  bed: ObjectId → Bed (required),
  
  // Financial
  rentAmount: Number (required),
  depositAmount: Number (required),
  dueDay: Number (default: 5),
  
  // Status
  status: Enum ['active', 'on_notice', 'vacated'],
  joiningDate: Date (required),
  noticeDate: Date,
  vacatingDate: Date,
  
  // KYC
  idProofType: Enum,
  idProofNumber: String,
  idProofUrl: String,
  addressProofUrl: String,
  
  timestamps: true
}
```

### Invoice
```javascript
{
  tenant: ObjectId → Tenant (required),
  property: ObjectId → Property (required),
  month: String,
  year: Number,
  items: [{
    description: String,
    amount: Number
  }],
  subtotal: Number,
  cgst: Number,
  sgst: Number,
  totalAmount: Number (required),
  status: Enum ['pending', 'paid', 'overdue'],
  dueDate: Date,
  paidDate: Date,
  timestamps: true
}
```

### Bed
```javascript
{
  number: String (required),
  status: Enum ['available', 'occupied', 'booked', 'notice'],
  room: ObjectId → Room (required),
  floor: ObjectId → Floor (required),
  block: ObjectId → Block (required),
  property: ObjectId → Property (required),
  tenant: ObjectId → Tenant,
  timestamps: true
}
```

### Complaint
```javascript
{
  title: String (required),
  description: String,
  category: Enum ['plumbing', 'electrical', 'food', 'hygiene', 'internet', 'other'],
  priority: Enum ['low', 'medium', 'high'],
  status: Enum ['open', 'in_progress', 'resolved'],
  property: ObjectId → Property (required),
  room: ObjectId → Room,
  bed: ObjectId → Bed,
  raisedBy: ObjectId → Tenant (required),
  assignedTo: ObjectId → Staff,
  timeline: [{
    status: String,
    updatedBy: ObjectId → Staff,
    comment: String,
    timestamp: Date
  }],
  timestamps: true
}
```

## 🔒 Middleware

### CORS Configuration
```javascript
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```

### File Upload (Multer)
```javascript
const upload = multer({ dest: 'uploads/' });
app.post('/api/tenants', upload.fields([...]), createTenant);
```

### Static Files
```javascript
app.use("/uploads", express.static("uploads"));
```

## 🔄 Transaction Handling

Critical operations use MongoDB transactions:

**Tenant Check-In**
```javascript
const session = await Tenant.startSession();
session.startTransaction();
try {
  // 1. Create tenant
  // 2. Update bed status
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

**Checkout Process**
```javascript
const session = await Tenant.startSession();
session.startTransaction();
try {
  // 1. Update tenant status
  // 2. Free bed
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

## 📊 Aggregation Pipelines

**Property Hierarchy**
```javascript
await Property.aggregate([
  { $match: { _id: propertyId } },
  {
    $lookup: {
      from: 'blocks',
      localField: '_id',
      foreignField: 'property',
      as: 'blocks',
      pipeline: [
        {
          $lookup: {
            from: 'floors',
            // ... nested lookups for floors → rooms → beds
          }
        }
      ]
    }
  }
]);
```

## 🐛 Error Handling

Standard error response format:
```javascript
res.status(400).json({ message: error.message });
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## 🔧 Development

### Nodemon Configuration
Auto-restarts on file changes in development mode.

### Database Connection
```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));
```

## 🚀 Deployment

### Environment Setup
1. Set `MONGO_URI` to production database
2. Set `PORT` (default: 5000)
3. Configure CORS for production frontend URL

### Deployment Platforms
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Deploy on droplet
- **AWS EC2**: Manual deployment

### Production Checklist
- [ ] Set production MongoDB URI
- [ ] Update CORS origin
- [ ] Set NODE_ENV=production
- [ ] Enable compression
- [ ] Add rate limiting
- [ ] Implement authentication
- [ ] Add request logging

## 📝 Best Practices

1. **Always use transactions** for operations affecting multiple collections
2. **Populate references** when needed to reduce client-side requests
3. **Validate input** before database operations
4. **Use async/await** for cleaner asynchronous code
5. **Handle errors** consistently across all controllers
6. **Index frequently queried fields** for better performance

## 🤝 Contributing

1. Follow RESTful conventions
2. Use consistent error handling
3. Add comments for complex logic
4. Test all CRUD operations
5. Update this README for new endpoints

---

**For frontend documentation, see `/client/README.md`**
