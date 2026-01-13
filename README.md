# 🛍️ Kids Outfit Store

![Project Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)

**Full-stack E-commerce application** built with modern web technologies. This project demonstrates a scalable architecture using NestJS microservices principles, Next.js for SSR, and containerized deployment.

🔗 **Live Demo:** [https://kids-outfit.ru](https://kids-outfit.ru)

---

## 🛠️ Tech Stack

### Backend (Nest.js)
* **Core:** NestJS (TypeScript)
* **Database:** PostgreSQL + TypeORM
* **Caching & Analytics:** Redis
* **Storage:** Cloudinary (Image synchronization)
* **Security:**
    * Custom JWT Authorization (Access/Refresh tokens)
    * CSRF Protection (Token based)
    * `@nestjs/throttler` for Rate Limiting
* **Documentation:** Swagger (OpenAPI)
* **Scheduling:** Cron jobs (Data migration from Redis to Postgres)

### Frontend (Next.js)
* **Framework:** Next.js (React)
* **State Management:** Redux Toolkit
* **UI Library:** Material UI (MUI)
* **Language:** TypeScript

### DevOps & Infrastructure
* **Containerization:** Docker & Docker Compose
* **Server:** VPS (Ubuntu)
* **CI/CD:** Manual deployment via `docker-compose.prod.yml`

---

## 🌟 Key Features & Technical Highlights

### 1. Admin Dashboard
Administrative panel designed for store management.
* **Content Management:** Full control over product listings, categories,  and user data.
* **Analytics & Insights:** Visualized statistics showing total user count, sales performance, and other key metrics.

### 2. Analytics System
Instead of writing every page visit directly to the database (which is slow), the application uses **Redis** to buffer visitor data (IP tracking).
* **Workflow:** User visits -> IP saved to Redis.
* **Cron Job:** Every 24 hours, a background service aggregates data from Redis and efficiently bulk-inserts it into PostgreSQL for permanent storage.

### 3. Robust Security
* **Throttling:** Protects against DDoS and brute-force attacks by limiting the number of requests per IP.
* **CSRF Protection:** Implemented using tokens to prevent Cross-Site Request Forgery.
* **Auth:** Fully custom implementation of JWT authentication without relying on heavy external auth providers.

### 4. Media Management
* Product images are automatically synchronized and optimized using the **Cloudinary API**.
* Lazy loading for products.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v22+)
* Docker & Docker Compose
* [Cloudinary storage]([URL](https://cloudinary.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/IvanYakunkin/kids-outfit.git](https://github.com/IvanYakunkin/kids-outfit.git)
    cd kids-outfit
    ```

2.  **Environment Setup**
    Delete all ".example" from the names of all env-files and fill them with your configuration;

4.  **Run with Docker (Development)**
    Use the development compose file to start the services with hot-reload.
    ```bash
    docker compose -f docker-compose.dev.yml up --build
    ```

5.  **Access the application**
    * Frontend: `http://localhost:3000`
    * Backend API: `http://localhost:5000`
    * Swagger Docs: `http://localhost:5000/api`

---

## 🐳 Production Deployment

The project is configured for production deployment using a separate compose file.

```bash
# Build and run in detached mode
docker compose -f docker-compose.prod.yml up -d --build
```
---

## 📸 Screenshots
Main page:

<img width="926" height="480" alt="Screenshot from 2026-01-13 19-21-47" src="https://github.com/user-attachments/assets/4cda1f8e-0f58-4b44-a69a-ba5ad11c6f9a" />

Admin:

<img width="926" height="480" alt="Screenshot from 2026-01-13 19-20-37" src="https://github.com/user-attachments/assets/67b7a48f-d889-4243-b7af-7f4fdc744071" />

Creating product page:

<img width="926" height="480" alt="Screenshot from 2026-01-13 19-24-18" src="https://github.com/user-attachments/assets/833e4f3b-e2d6-42c6-bdf0-8ccb3481b357" />


