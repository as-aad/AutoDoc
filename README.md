<div align="center">

# 🚗 AutoDoc

### Vehicle Maintenance & Repair Marketplace

*Connecting vehicle owners with verified mechanics and garages — all in one platform.*

[![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20MySQL-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](#license)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)](#)

</div>

---

## 📖 Overview

**AutoDoc** is a full-stack marketplace platform that brings together **vehicle owners**, **mechanics**, and **garages** in one place. Owners can track their vehicle's full service history, request repairs, compare quotes from garages, book services, manage warranties, and rate service providers — while garages and mechanics manage bookings, upload repair progress, and generate invoices.

Think of it as the meeting point between "I need my car fixed" and "I can fix your car" — with transparency, history tracking, and trust built in.

---

## ✨ Features

### 🔐 Authentication & User Management
- Role-based registration & login — **Customer**, **Mechanic**, **Garage Owner**
- Separate **Admin** login
- Independent sessions per browser tab (multi-login support)
- Editable profile with image upload

### 🚙 Vehicle Management
- Register and manage multiple vehicles per customer
- Update mileage and upload documents (registration, insurance, etc.)
- Full maintenance history per vehicle
- Automated maintenance & renewal reminders
- Personal vehicle dashboard with service/info panel

### 🏢 Garage & Mechanic Management *(Admin)*
- Create and manage garages
- Verify mechanic certifications
- Assign mechanics to garages
- Manage all customers, mechanics, and garages from one panel

### 🛠️ Service Requests & Booking
- Customers post repair requests with description + photos
- Garages submit competitive price quotes
- Customers compare quotes and book a garage or mechanic
- Booking history & status visible to all parties

### 🔧 Repair & Maintenance Tracking
- Before/after repair photo uploads by mechanics
- Real-time repair progress updates
- Digital invoices & warranty record generation
- Permanent, searchable service history per vehicle

### ⭐ Reviews & Reports
- Customers rate garages and mechanics post-service
- Vehicle health & maintenance reports
- Garage owners get booking & revenue analytics

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + Next.js |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL / MySQL |
| **ORM** | Prisma |

---

## 🏗️ Project Structure

autodoc/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/           # Express.js backend
├── packages/
│   └── prisma/         # Shared Prisma schema & client
├── README.md
└── .gitignore

> Structure will evolve as the project is scaffolded.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/autodoc.git
cd autodoc

# Install dependencies (once scaffolded)
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development servers
npm run dev
```

> Setup instructions will be updated as the backend and frontend are added.

---

## 🗺️ Roadmap

- [ ] Database schema design (Prisma models)
- [ ] Authentication & role-based access
- [ ] Vehicle management module
- [ ] Service request & booking flow
- [ ] Repair tracking & invoicing
- [ ] Reviews & analytics dashboards
- [ ] Deployment

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ for vehicle owners and the mechanics who keep them on the road.

</div>

