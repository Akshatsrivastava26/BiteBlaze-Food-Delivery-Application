# 🍔 BiteBlaze – Real-Time Food Delivery Application

BiteBlaze is a **full-stack real-time food delivery platform** built to simulate a production-level delivery ecosystem. The platform connects **customers, restaurant/shop owners, and delivery partners** through a seamless ordering workflow powered by REST APIs and real-time communication.

The system supports:

* Multi-role authentication
* Live order updates
* Delivery assignment
* OTP-based delivery verification
* Real-time tracking
* Secure payments
* Geo-location based services

---

# 🚀 Features

## 👤 Customer Features

* User Registration & Login
* JWT-based Authentication
* Browse Restaurants & Food Items
* Search & Filter Food
* Add to Cart
* Checkout Process
* Delivery Address Selection
* Online Payment Integration
* Cash on Delivery Option
* Live Order Tracking
* Real-Time Status Updates
* OTP Verified Delivery Completion
* Order History

---

## 🏪 Restaurant / Shop Owner Features

* Shop Dashboard
* Add / Edit / Delete Food Items
* Upload Food Images
* Receive Orders in Real-Time
* Accept / Reject Orders
* Update Order Status
* Manage Inventory & Listings

---

## 🚚 Delivery Partner Features

* Receive Nearby Delivery Assignments
* Accept Orders Dynamically
* Live Location Sharing
* Delivery Navigation
* OTP-Based Delivery Confirmation
* Real-Time Assignment Updates

---

# 🧰 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* React Router DOM
* React Leaflet

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication & Security

* JWT Authentication
* Cookie-Based Session Handling
* bcrypt Password Encryption

## Real-Time Communication

* Socket.IO

## Payment Gateway

* Razorpay Integration

## File Storage

* Cloudinary

## Maps & Tracking

* Leaflet Maps
* Geolocation API

## Email Services

* Nodemailer (OTP Verification)

---

# 🏗️ System Architecture

The application follows a **Full-Stack MERN Architecture**.

```text
Frontend (React + Redux)
        ↓
REST APIs + Socket.IO
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Database
```

Real-time features are powered using **Socket.IO**, allowing instant communication between:

* Customer
* Restaurant Owner
* Delivery Partner

---

# 📂 Project Structure

```bash
BiteBlaze-Food-Delivery-Application/
│
├── frontend/                 # React Frontend
├── backend/                  # Node.js + Express Backend
├── public/                   # Static Assets
├── uploads/                  # Uploaded Files
├── controllers/              # API Controllers
├── models/                   # MongoDB Models
├── routes/                   # API Routes
├── middleware/               # Auth & Validation Middleware
├── sockets/                  # Socket.IO Handlers
├── utils/                    # Helper Functions
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Akshatsrivastava26/BiteBlaze-Food-Delivery-Application.git
cd BiteBlaze-Food-Delivery-Application
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside your backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

# 📡 Real-Time Workflow

## 1. Authentication & Initialization

* User logs in
* JWT token created
* User location detected
* Shops loaded based on city/location

## 2. Order Placement

* Customer adds items to cart
* Checkout completed
* Address selected
* Backend groups orders by shop

## 3. Payment Handling

* Razorpay order generated
* Payment verification
* Order confirmation

## 4. Real-Time Order Processing

* Shop owner receives live order notification
* Accepts order
* Updates status

## 5. Delivery Assignment

* Nearby delivery partners detected
* Assignment broadcasted
* Delivery partner accepts request

## 6. Live Tracking

* Delivery partner shares location continuously
* Customer sees real-time movement on map

## 7. Delivery Completion

* OTP sent to customer
* Delivery partner verifies OTP
* Order marked as delivered

---

# 📸 Screenshots

Add screenshots for:

* Home Page
* Restaurant Listing
* Food Menu
* Cart Page
* Checkout Page
* Payment Screen
* Live Tracking Map
* Shop Dashboard
* Delivery Dashboard

Example:

<img width="1908" height="907" alt="Screenshot 2026-04-21 100532" src="https://github.com/user-attachments/assets/28b48dab-ec2b-48bd-b768-12018fcc421e" />


---

# 🎯 Key Highlights

* Real-Time Order Tracking
* Event-Driven Architecture
* Multi-Role Platform
* Scalable MERN Stack Design
* Secure Authentication
* Socket-Based Live Communication
* OTP Delivery Verification
* Geo-Based Delivery Assignment

---

# 🌍 Future Enhancements

* AI Food Recommendation System
* Push Notifications
* In-App Chat Between User & Delivery Partner
* Coupon & Discount System
* Rating & Reviews
* Analytics Dashboard

---

# 🤝 Contributing

Contributions are welcome.

1. Fork Repository
2. Create Feature Branch
3. Commit Changes
4. Push Changes
5. Create Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Akshat Kumar Srivastava**

* GitHub: [https://github.com/Akshatsrivastava26](https://github.com/Akshatsrivastava26)

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.
