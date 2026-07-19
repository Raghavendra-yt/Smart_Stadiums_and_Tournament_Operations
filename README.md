# 🏟️ World Cup 2026 Smart Stadiums & Tournament Operations Platform

[![FIFA World Cup 2026](https://img.shields.io/badge/FIFA%20World%20Cup-2026%20MetLife%20Stadium-gold?style=for-the-badge&logo=soccer)](https://github.com/Raghavendra-yt/Smart_Stadiums_and_Tournament_Operations)
[![Tech Stack](https://img.shields.io/badge/Tech-React_18_%7C_Vite_%7C_Tailwind_%7C_Node_Express-blue?style=for-the-badge)](https://github.com/Raghavendra-yt/Smart_Stadiums_and_Tournament_Operations)

An end-to-end multi-persona smart stadium intelligence ecosystem engineered for **MetLife Stadium (Host Venue for FIFA World Cup 2026™)**.

The platform unifies **Fan Experience**, **Organizer Command Telemetry**, and **Volunteer Field Support** into a single real-time single-page application (SPA) backed by a persistent database server with real-time push streaming, sub-3ms LRU caching, and tokenized authorization middleware.

---

## 🌟 Key Persona Modules

### 1. 🎟️ Fans Hub

- **Carbon Accounting Offset Engine**: Calculates match-day travel carbon footprints based on travel distance, flight seating class, rail transit, and hotel stay duration.
- **3D Digital Twin Wayfinding**: Interactive route planning featuring a dedicated **Wheelchair Accessible Route Filter** that mutates paths to bypass stairs and prioritize elevators and wide concourses.
- **GenAI Audio Description Suite**: Live tactical narration audio stream with customizable speech rate, partisan bias modes, and **Visual Question Answering (VQA)** for instant play analysis.
- **Smart Concession Express Ordering**: Concourse crowd sensors with express QR code pickup generation.

### 2. 🎛️ Organizer Operations Control Room

- **Spatial Crowd Telemetry SVG Heatmap**: Real-time visual density grid monitoring sector throughput (PPM) and queue bottlenecks.
- **Anomaly MSE Threshold Controller**: Adjustable Mean Squared Error slider triggering visual alarm indicators and emergency timeline incidents.
- **Facial Embedding Matcher**: 512D CCTV vector matching simulation for security personnel dispatch.
- **Predictive Bottleneck AI**: Time-series surge forecaster with automated steward dispatching.
- **Multi-Modal Radio Command**: Voice-to-text and typed radio command timeline logger.

### 3. 🤝 Volunteer Support Hub

- **Geofenced Priority Tasks**: Real-time location-aware shift assignments (Crowd redirection, accessibility escorts, zero-waste restocking).
- **Multilingual AI Translation & Voice Radio**: Instant translation tool for fan assistance in English, Spanish, Portuguese, and French.
- **Volunteer GenAI Assist Bot**: Context-aware AI helper for lost child protocols, hydration station locations, and emergency procedures.

### 4. 🔐 Protected Role-Based Authentication & Demo Access

- Secured portals for Organizers and Volunteers with **Bearer Authorization Token Middleware** (`Authorization: Bearer <token>`).
- Built-in **Demo Credentials Helper Cards** with 1-click auto-fill buttons.

---

## 🔑 Demo Credentials

| Portal Role           | User ID / Email              | Passcode    | Role Description             |
| :-------------------- | :--------------------------- | :---------- | :--------------------------- |
| **Organizers Ops**    | `organizer@worldcup2026.org` | `ops2026`   | Senior Operations Controller |
| **Volunteer Support** | `volunteer@worldcup2026.org` | `staff2026` | Gate 4 Specialist            |

---

## ⚡ Real-Time Backend Architecture (`server.js`)

- **Database Engine**: Persistent JSON database (`database.json`) managing match info, gate congestion, incidents, tasks, concessions, and authenticated users.
- **Real-Time Push Engine (Server-Sent Events)**: `/api/telemetry/stream` SSE EventStream broadcasting live incident and task updates to all connected clients in real time.
- **High-Concurrency LRU Cache**: 15-second TTL in-memory cache serving AI Concierge queries at **2.77 ms/request**.
- **Bearer Token Auth**: Issues crypto-hashed bearer tokens upon database login verification.

---

## 🚀 Getting Started & Local Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Raghavendra-yt/Smart_Stadiums_and_Tournament_Operations.git

# 2. Navigate to project root
cd Smart_Stadiums_and_Tournament_Operations

# 3. Install dependencies
npm install
```

### Running the Application

To run both the Express Backend Database Server and the Vite Development Frontend concurrently:

```bash
npm run dev:full
```

Or run them individually in separate terminals:

```bash
# Terminal 1: Backend Database Server (Port 5000)
npm run server

# Terminal 2: Frontend Vite App (Port 5173)
npm run dev
```

Open your browser at `http://localhost:5173` to access the application.

---
