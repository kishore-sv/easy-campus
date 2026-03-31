# Easy Campus - Production Ready Full-Stack MVP

Easy Campus is an all-in-one university management application designed to solve navigational and administrative friction.

## 📁 Project Structure

```text
/easy-campus/
├── backend/            # Express, Node, MongoDB
│   ├── controllers/    # Refactored Logic
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   └── seed.js         # Seeder for faculty & products
├── frontend/           # React, Tailwind, Framer Motion
│   ├── src/            # Core UI Logic
│   └── public/         # Static assets
└── package.json        # Main control for backend & frontend
```

---

## 🛠️ Setup Instructions

### 1. Requirements
Ensure you have **Node.js** and **MongoDB** installed and running on your system.

### 2. Full Installation
From the root directory, install all dependencies for both backend and frontend:
```bash
npm install && npm run install:all
```

### 3. Environment Configuration
Create a `.env` file inside the `backend/` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/easycampus
JWT_SECRET=campus_secret_key_2024
```

### 4. Seed Database
Run the seeding script to preload faculty (Sunitha BJ, Bikram Sarkar, etc.), products, and default accounts:
```bash
npm run seed
```

### 5. Run the Application
Start both the backend and frontend simultaneously with a single command from the root:
```bash
npm run dev
```

---

## 🔑 Preloaded Accounts (Pre-built)

### Student Account:
- **Email:** `student@easycampus.com`
- **Password:** `studentpassword123`

### Admin Account:
- **Email:** `admin@easycampus.com`
- **Password:** `adminpassword123`

---

## 🚀 Features

- **Smart Campus Navigation:** Search for faculty members, labs, or classrooms.
- **AI Campus Chatbot:** Instant answers about campus schedules and locations.
- **Events Dashboard:** Student registration with **digital QR tickets**.
- **Canteen & Shopping:** Real-time food ordering and stationery purchasing.
- **Lost & Found:** Community reporting system for misplaced items.
- **Grievance Portal:** High-fidelity secure reporting for student concerns.

Enjoy your new Smart Campus!
