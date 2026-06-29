# 🏥 Smart Hospital Queue Management System

> A real-time hospital queue management system that reduces patient wait times and improves hospital workflow efficiency through intelligent priority scheduling.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)

---

## Overview

Traditional hospital queues are static and opaque — patients wait without knowing how long or why. This system replaces that with a smart, real-time queue that:

- Assigns patients based on **triage severity** (Emergency → Urgent → Normal)
- Updates all screens **live** using WebSockets
- Lets doctors **call next patient** from a dashboard
- Gives patients a **digital token** with estimated wait time

## Features

- 🎫 **Patient registration** — name, symptoms, severity triage
- 📋 **Priority queue** — auto-sorted by severity and arrival time
- 📺 **Live display board** — real-time queue visible to patients
- 🩺 **Doctor dashboard** — call next, mark complete, add notes
- 📊 **Admin panel** — analytics, average wait times, queue stats
- 🔔 **SMS notifications** (optional) — notify patient when their turn is near
- 📱 **Mobile responsive** — works on tablets at reception desks

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Database | MongoDB + Mongoose |
| Auth | JWT |

## Project structure

```
Smart-Hospital-Queue-Management-System/
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/
│   │   │   ├── PatientView.jsx      # Patient-facing queue display
│   │   │   ├── DoctorDashboard.jsx  # Doctor console
│   │   │   ├── AdminPanel.jsx       # Admin analytics
│   │   │   └── Register.jsx         # Patient registration
│   │   ├── socket.js         # Socket.io client setup
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Patient.js    # Patient schema
│   │   │   └── Queue.js      # Queue schema
│   │   ├── routes/
│   │   │   ├── patients.js   # CRUD for patients
│   │   │   └── queue.js      # Queue management
│   │   ├── socket/
│   │   │   └── events.js     # Socket.io event handlers
│   │   └── server.js
│   └── package.json
├── .env.example
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 1. Clone the repo

```bash
git clone https://github.com/HariRathnam-hub/Smart-Hospital-Queue-Management-System.git
cd Smart-Hospital-Queue-Management-System
```

### 2. Set up the backend

```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your values
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment variables

```env
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-queue
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173

# Optional: Twilio for SMS notifications
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_PHONE=+1234567890
```

## Priority levels

| Level | Colour | Description | Target wait |
|---|---|---|---|
| P1 — Emergency | 🔴 Red | Life-threatening, immediate care | < 5 min |
| P2 — Urgent | 🟠 Orange | Serious but stable | < 30 min |
| P3 — Normal | 🟢 Green | Routine consultation | < 60 min |

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/patients/register` | Register new patient |
| `GET` | `/api/queue` | Get current queue |
| `PUT` | `/api/queue/next` | Call next patient |
| `PUT` | `/api/queue/:id/complete` | Mark consultation done |
| `GET` | `/api/admin/stats` | Queue analytics |

## Roadmap

- [ ] QR code token for patients
- [ ] Multi-department support (OPD, Emergency, Pharmacy)
- [ ] Doctor availability scheduling
- [ ] Integration with hospital management systems (HMS)
- [ ] PWA for offline support at reception

## Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

## License

[MIT](LICENSE)
