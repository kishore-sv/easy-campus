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
NODEMAILER_USER=test@gmail.com
NODEMAILER_PASS=testpass123
GEMINI_API_KEY=api_key
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

### Admin Account:
- **Email:** `admin@gmail.com`
- **Password:** `admin@123`

### Student Accounts (10):
Format: `name.rollno@presidencyuniversity.in` | Password: `DD-MM-YYYY`

1. **Aarav Sharma**
   - Email: `aarav.2024cs001@presidencyuniversity.in`
   - Password: `12-05-2003`
2. **Ananya Iyer**
   - Email: `ananya.2024cs002@presidencyuniversity.in`
   - Password: `24-08-2003`
3. **Bikram Das**
   - Email: `bikram.2024is001@presidencyuniversity.in`
   - Password: `05-11-2002`
4. **Chetan Reddy**
   - Email: `chetan.2024me005@presidencyuniversity.in`
   - Password: `15-02-2003`
5. **Divya Nair**
   - Email: `divya.2024ai008@presidencyuniversity.in`
   - Password: `30-09-2003`
6. **Eshan Gupta**
   - Email: `eshan.2023ec012@presidencyuniversity.in`
   - Password: `11-01-2002`
7. **Farhan Khan**
   - Email: `farhan.2024ds003@presidencyuniversity.in`
   - Password: `18-06-2003`
8. **Gauri Patil**
   - Email: `gauri.2024cv009@presidencyuniversity.in`
   - Password: `09-03-2003`
9. **Harsh Vardhan**
   - Email: `harsh.2024ee015@presidencyuniversity.in`
   - Password: `21-07-2002`
10. **Ishani Bose**
    - Email: `ishani.2024bt004@presidencyuniversity.in`
    - Password: `03-12-2003`

---

## 🚀 Features

- **Smart Campus Navigation:** Search for faculty members, labs, or classrooms.
- **AI Campus Chatbot:** Instant answers about campus schedules and locations.
- **Events Dashboard:** Student registration with **digital QR tickets**.
- **Canteen & Shopping:** Real-time food ordering and stationery purchasing.
- **Lost & Found:** Community reporting system for misplaced items.
- **Grievance Portal:** High-fidelity secure reporting for student concerns.

Enjoy your new Smart Campus!
