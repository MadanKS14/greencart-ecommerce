# 🛒 GreenCart

A full-stack MERN e-commerce platform built to provide a seamless online grocery shopping experience. GreenCart allows users to browse products, manage carts, place orders, make secure payments, and track purchases, while sellers can manage products and orders through a dedicated dashboard.

---

## 🚀 Live Demo

### Frontend
https://greencart-ecommerce-ashen.vercel.app
### Backend API
https://greencart-ecommerce.onrender.com

---

# ✨ Features

## Customer Features

- User Registration & Login
- JWT Authentication
- Secure Cookie-Based Sessions
- Browse Products
- Product Search
- Product Categories
- Product Details View
- Shopping Cart Management
- Address Management
- Cash on Delivery (COD)
- Stripe Payment Integration
- Order History
- Responsive Design

## Seller Features

- Seller Authentication
- Seller Dashboard
- Add Products
- Manage Products
- Upload Product Images
- View Orders
- Revenue Tracking
- Dashboard Analytics

## Payment Features

- Stripe Checkout Integration
- Secure Online Payments
- Stripe Webhooks
- Automatic Order Confirmation
- Automatic Cart Clearing After Payment

---

# 🏗️ Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- Multer

## Cloud Services

- MongoDB Atlas
- Cloudinary
- Stripe

## Deployment

- Vercel
- Render / Node Hosting
- MongoDB Atlas

---

# 📂 Project Structure

```text
GreenCart
│
├── client
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public
│   └── package.json
│
├── server
│   ├── configs
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🗄️ Database Models

## User

```javascript
{
  name,
  email,
  password,
  role,
  cartItems
}
```

## Product

```javascript
{
  name,
  description,
  price,
  offerPrice,
  image,
  category,
  inStock
}
```

## Address

```javascript
{
  userId,
  firstName,
  lastName,
  email,
  street,
  city,
  state,
  zipcode,
  country,
  phone
}
```

## Order

```javascript
{
  userId,
  items,
  amount,
  orderStatus,
  paymentType,
  isPaid
}
```

---

# 🔐 Authentication

GreenCart uses JWT-based authentication.

### Registration Flow

1. User submits registration form
2. Password is hashed using bcrypt
3. User is stored in MongoDB
4. JWT token is generated
5. Token is stored in an HTTP-only cookie

### Login Flow

1. User submits credentials
2. Password verification using bcrypt
3. JWT token generation
4. Secure cookie creation
5. User session established

---

# 🛒 Cart Workflow

```text
Browse Products
       ↓
Add To Cart
       ↓
Update Quantity
       ↓
Proceed To Checkout
       ↓
Select Address
       ↓
Place Order
```

---

# 💳 Payment Workflow

## Cash On Delivery

```text
Cart
 ↓
Checkout
 ↓
Select Address
 ↓
Place Order
 ↓
Order Confirmed
```

## Stripe Payment

```text
Cart
 ↓
Checkout
 ↓
Stripe Checkout
 ↓
Payment Success
 ↓
Webhook Verification
 ↓
Order Confirmed
 ↓
Cart Cleared
```

---

# 🌐 API Endpoints

## User Routes

```http
POST /api/user/register
POST /api/user/login
GET  /api/user/logout
GET  /api/user/is-auth
```

## Seller Routes

```http
POST /api/seller/login
GET  /api/seller/logout
GET  /api/seller/is-auth
```

## Product Routes

```http
POST /api/product/add
GET  /api/product/list
GET  /api/product/:id
POST /api/product/change-stock
```

## Cart Routes

```http
POST /api/cart/update
```

## Address Routes

```http
POST /api/address/add
GET  /api/address/get
```

## Order Routes

```http
POST /api/order/cod
POST /api/order/stripe
GET  /api/order/user
GET  /api/order/seller
```

---

# ⚙️ Environment Variables

## Backend (.env)

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

---

# 💻 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/GreenCart.git
```

## Install Frontend Dependencies

```bash
cd client
npm install
```

## Install Backend Dependencies

```bash
cd server
npm install
```

## Start Frontend

```bash
npm run dev
```

## Start Backend

```bash
npm start
```

---

# 📈 Dashboard Features

- Total Products
- Total Orders
- Total Customers
- Total Revenue
- Recent Orders Overview
- Revenue Analytics
- Product Management

---

# 🎯 Learning Outcomes

This project helped strengthen my understanding of:

- MERN Stack Development
- REST API Development
- MongoDB Data Modeling
- Authentication & Authorization
- Stripe Payment Integration
- Cloudinary Image Management
- React State Management
- Context API
- Responsive UI Design
- Deployment Workflows

---

# 🔮 Future Improvements

- Product Reviews & Ratings
- Wishlist Functionality
- Inventory Management
- Coupon System
- Email Notifications
- Advanced Analytics
- Product Recommendations
- Admin Dashboard
- Multi-Vendor Support

---

# 👨‍💻 Author

**Madan K S**

MERN Stack Developer

GitHub: https://github.com/MadanKS14

LinkedIn: https://linkedin.com/in/your-linkedin-profile

---

# ⭐ Support

If you found this project useful, consider giving it a star on GitHub.
