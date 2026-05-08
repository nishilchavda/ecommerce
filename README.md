# E-Commerce Platform

A professional, full-stack e-commerce application built with modern web technologies. This project features a robust Node.js/Express backend and a dynamic, high-performance React frontend.

![Homepage](/frontend/public/Homepage.png)

## 🚀 Features

- **User Authentication:** Secure login and registration using JWT and Bcrypt.
- **Product Management:** Full CRUD operations for products with image upload support.
- **Shopping Cart:** Seamlessly add/remove items and manage quantities.
- **Order Tracking:** Detailed order history and status tracking.
- **Admin Dashboard:** Comprehensive control panel for managing products, users, and orders.
- **Modern UI/UX:** Responsive design powered by Tailwind CSS and smooth animations with GSAP.
- **AI Integration:** Integrated with Google Generative AI for enhanced features.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** GSAP & @gsap/react
- **Routing:** React Router DOM
- **State Management:** Axios & React Hooks
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt
- **File Uploads:** Multer
- **Emailing:** Nodemailer
- **AI:** Google Generative AI SDK

## 📂 Project Structure

```text
.
├── backend/            # Express API & Server Logic
│   ├── config/         # Database & App Configurations
│   ├── controllers/    # Request Handlers
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   ├── services/       # Business Logic
│   └── middlewares/    # Custom Middlewares (Auth, Validation)
└── frontend/           # React Client Application
    ├── src/
    │   ├── Pages/      # Application Screens
    │   ├── Components/ # Reusable UI Components
    │   └── assets/     # Static Resources
    └── public/         # Static Files
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ecomm
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   # Add other environment variables as needed
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 📜 License
This project is licensed under the ISC License.
