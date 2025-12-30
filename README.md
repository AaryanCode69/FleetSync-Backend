# 🚀 FleetSync: Hyper-Local Delivery Orchestration Engine

> **A High-Performance Backend for On-Demand Delivery Services built with NestJS.**

**FleetSync** is a complex, event-driven backend system designed to simulate the core logistics of platforms like **Uber Eats** or **DoorDash**. Unlike standard CRUD applications, FleetSync handles **real-time geospatial data**, **asynchronous driver matching**, and **high-concurrency state management**.

This project demonstrates the transition from a Monolithic architecture to Event-Driven patterns using **NestJS**, **PostgreSQL (PostGIS)**, and **Redis**.

---

## 🛠️ Tech Stack

* **Framework:** [NestJS](https://nestjs.com/) (Node.js/TypeScript)
* **Database:** PostgreSQL 15 with **PostGIS** extension (Spatial Data)
* **ORM:** TypeORM (Repository Pattern)
* **Caching & Queues:** Redis + **BullMQ** (Async Job Processing)
* **Real-Time:** Socket.io (Bi-directional Gateway)
* **Validation:** `class-validator` & `class-transformer`
* **Containerization:** Docker & Docker Compose

---

## 🌟 Key Features

### 1. 📍 Geospatial Core (PostGIS)
* **Smart Discovery:** Uses **K-Nearest Neighbors (KNN)** algorithms to find drivers within a specific radius of a restaurant.
* **Location Tracking:** Stores and updates driver coordinates using `GEOMETRY(Point, 4326)` for sub-second spatial queries.

### 2. ⚡ Asynchronous Matching Engine (BullMQ)
* **Non-Blocking APIs:** Order placement is instant (`202 Accepted`). The heavy lifting of finding a driver happens in the background.
* **Reliability:** Implements exponential backoff and retry strategies if no drivers are initially found.

### 3. 📡 Real-Time Updates (Socket.io)
* **Live Order Tracking:** Pushes status updates (`ASSIGNED`, `PICKED_UP`) to customers instantly.
* **Driver Offers:** Sends job offers to driver applications in real-time.

### 4. 🔐 Enterprise-Grade Security
* **RBAC:** Role-Based Access Control for `Admin`, `Customer`, and `Driver`.
* **JWT Auth:** Secure stateless authentication for both REST APIs and WebSocket connections.

---

## 🏗️ Architecture Overview

The system follows a modular monolith approach:

1.  **API Gateway (Controllers):** Handles HTTP requests and Input Validation (DTOs).
2.  **Service Layer:** Contains business logic and transactional boundaries.
3.  **The "Dispatcher" (Queue Producer):** Offloads heavy tasks (Matching) to Redis.
4.  **Worker Nodes (Queue Consumer):** Processes background jobs and updates the DB.
5.  **Event Gateway:** Broadcasts changes to connected clients via WebSockets.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or v20 LTS)
* **Docker Desktop** (Essential for PostGIS and Redis)
* **Postman** (For API & WebSocket testing)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/fleetsync.git](https://github.com/your-username/fleetsync.git)
    cd fleetsync
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    # Application
    PORT=3000
    NODE_ENV=development

    # Database (Postgres + PostGIS)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=fleet_secure
    DB_NAME=fleetsync

    # Redis (Queue & Cache)
    REDIS_HOST=localhost
    REDIS_PORT=6379

    # Auth
    JWT_SECRET=super_secret_key_change_this
    JWT_EXPIRATION=15m
    ```

4.  **Spin up Infrastructure (Docker)**
    This command starts PostgreSQL (with PostGIS enabled) and Redis.
    ```bash
    docker-compose up -d
    ```

5.  **Run the Server**
    ```bash
    # Development mode (Watch mode)
    npm run start:dev
    ```

---

## 📚 API Documentation (Swagger)

Once the server is running, visit:
**`http://localhost:3000/api`**

FleetSync uses `@nestjs/swagger` to auto-generate OpenAPI documentation. You can test endpoints directly from the browser.

---

## 🛣️ Roadmap

* [ ] **Phase 1:** User Auth & Profile Management (JWT)
* [ ] **Phase 2:** Restaurant & Menu CRUD with Caching
* [ ] **Phase 3:** PostGIS Integration for Driver Location Updates
* [ ] **Phase 4:** Order Placement & BullMQ Setup
* [ ] **Phase 5:** WebSocket Integration for Live Tracking

---

## 🤝 Contribution
This is a learning project designed to master NestJS patterns. Suggestions and Pull Requests are welcome!
