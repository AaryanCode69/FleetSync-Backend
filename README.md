# 🚀 FleetSync: Hyper-Local Delivery Orchestration Engine

> **High-Performance Event-Driven Backend for On-Demand Logistics**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📖 Overview

**FleetSync** is a robust, event-driven backend system designed to simulate the core logistics engine of platforms like **Uber Eats** or **DoorDash**. Unlike standard CRUD applications, FleetSync is engineered to handle **real-time geospatial data**, **asynchronous driver matching**, and **high-concurrency state management**.

This project demonstrates the architectural transition from a simple Monolith to a **Modular Monolith with Event-Driven patterns**, utilizing **NestJS**, **PostgreSQL (PostGIS)**, and **Redis/BullMQ** to ensure scalability and fault tolerance.

---

## 🏗️ System Architecture

FleetSync adopts a **Producer-Consumer** architecture for its core matching logic to ensure the main API thread remains non-blocking.

### High-Level Data Flow

1.  **Ingestion:** Client (User) places an order via REST API. The system validates and instantly acknowledges (`202 Accepted`).
2.  **Event Bus:** The order event is pushed to a **Redis Queue (BullMQ)**.
3.  **Processing:** A background **Worker Node** picks up the job and executes the **Geospatial Query (PostGIS)** to find the nearest available drivers (KNN).
4.  **Real-Time Dispatch:** Once a match is found, the **WebSocket Gateway** pushes an "Offer" event directly to the Driver's device.
5.  **State Management:** Order status updates ("Accepted", "Picked Up", "Delivered") are broadcasted via WebSockets to all relevant parties.

### Architecture Diagram

```mermaid
graph TD
    Client[Client App (User/Driver)] -->|HTTP REST| APIGateway[API Gateway / NestJS Controllers]
    Client <-->|WebSocket / Socket.io| WSGateway[Event Gateway]

    subgraph "Core Backend Services"
        APIGateway --> Auth[Auth Guard (JWT)]
        APIGateway --> OrderService[Order Service]

        OrderService -->|Write| DB[(PostgreSQL + PostGIS)]
        OrderService -->|Add Job| Queue[Redis Queue (BullMQ)]
    end

    subgraph "Async Processing Layer"
        Queue -->|Consume| MatchWorker[Matching Worker]
        MatchWorker -->|Spatial Query| DB
        MatchWorker -->|Cache Hot Data| Redis[(Redis Cache)]
    end

    subgraph "Real-Time Layer"
        MatchWorker -->|Trigger Event| WSGateway
        WSGateway -->|Push Notification| Client
    end
```

---

## 🛠️ Tech Stack

| Category              | Technology                                         |
| --------------------- | -------------------------------------------------- |
| **Framework**         | NestJS (Node.js/TypeScript) - Modular architecture |
| **Database**          | PostgreSQL 15 - Relational data                    |
| **Spatial Engine**    | PostGIS - Geospatial indexing and KNN search       |
| **Queue & Messaging** | BullMQ (on Redis) - Asynchronous job processing    |
| **Caching**           | Redis - Session storage and geospatial caching     |
| **Real-Time**         | Socket.io - Bi-directional communication           |
| **Containerization**  | Docker & Docker Compose                            |

---

## 🌟 Key Features

### 1. 📍 Geospatial Core (PostGIS)

- **Smart Discovery**: Utilizes K-Nearest Neighbors (KNN) algorithms (`<->` operator) to efficiently query drivers within a specific radius.
- **Spatial Indexing**: Implements GiST (Generalized Search Tree) indexes on driver locations for sub-millisecond query performance.
- **Location Tracking**: Stores coordinates using `GEOMETRY(Point, 4326)` standard.

### 2. ⚡ Asynchronous Matching Engine

- **Non-Blocking APIs**: Order placement is decoupled from driver finding. The API responds immediately, while the "Matching" happens in the background.
- **Resiliency**: Implements exponential backoff and automatic retries if no drivers are found initially.

### 3. 📡 Real-Time Updates (WebSocket)

- **Live Order Tracking**: State changes (`ORDER_ACCEPTED`, `DRIVER_ARRIVING`) are pushed instantly to the client.
- **Driver Negotiation**: Sends real-time job offers to drivers; handles "Accept/Reject" logic via socket events.

### 4. 🔐 Enterprise-Grade Security

- **RBAC**: Strict Role-Based Access Control (ADMIN, CUSTOMER, DRIVER).
- **JWT Authentication**: Stateless authentication securing both REST endpoints and WebSocket handshakes.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Docker Desktop (Required for PostGIS & Redis)
- npm or pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/fleetsync.git
cd fleetsync
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory:

```env
# App
PORT=3000
NODE_ENV=development

# Database (Docker Service Name: db)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=fleet_secure
DB_NAME=fleetsync

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth
JWT_SECRET=your_super_secure_secret
JWT_EXPIRATION=15m
```

4. **Start Infrastructure**

Spin up PostgreSQL (with PostGIS) and Redis using Docker Compose:

```bash
docker-compose up -d
```

5. **Run the Application**

```bash
# Development Mode
npm run start:dev
```

---

## 📚 API Documentation

FleetSync integrates Swagger/OpenAPI for auto-generated documentation.

- **Swagger UI**: `http://localhost:3000/api`
- **OpenAPI JSON**: `http://localhost:3000/api-json`

Use the Swagger UI to test endpoints like `POST /auth/login`, `POST /orders`, and `PATCH /drivers/location`.

---

## 🛣️ Roadmap

- [ ] Phase 1: Core Authentication & User Profiles (JWT)
- [ ] Phase 2: Restaurant Menu Management (CRUD)
- [ ] Phase 3: PostGIS Integration for Driver Updates
- [ ] Phase 4: Order Ingestion & Queue Setup (BullMQ)
- [ ] Phase 5: WebSocket Gateway & Live Tracking
