# MarketFlex v2 - E-Commerce Backend Modernization

**Status:** Active Development | **Focus:** Legacy to Cloud-Native Migration

## 📄 Project Overview

MarketFlex is an e-commerce backend project originally built as a monolithic application. I am currently refactoring the codebase to modernize the architecture, implementing a "Headless" approach by decoupling the frontend and backend.

The primary goal of this project is to demonstrate a comprehensive migration path from a legacy server-side rendered system (Thymeleaf) to a modern, high-performance REST API architecture. This repository serves as a practical case study for adopting next-generation Java ecosystems and reactive frontend patterns.

## 🛠️ Tech Stack

### Backend (Core)
* **Language:** Java 25 (Preview Features Enabled)
* **Framework:** Spring Boot 4.0.0
* **Security:** Spring Security 7 (Stateless JWT & RBAC)
* **Database:** PostgreSQL 18 (Development via Docker, Production via **Neon.tech**)
* **Build Tool:** Gradle 9.x

### Frontend (Vision & Architecture)
* **Runtime:** Node.js 22
* **Framework:** React 19.2 (via **Vite**)
* **Styling:** Tailwind CSS 4.x
* **State Management:** **Zustand** (Global State)
* **Data Fetching:** **TanStack Query v5** (Server State & Caching)
* **Validation:** **Zod** (Schema Validation)

### Infrastructure & DevOps
* **Containerization:** Docker (Multi-stage builds)
* **CI/CD:** GitHub Actions
* **Cloud Platform:** Google Cloud Run

## 🚀 Key Technical Improvements

* **API Transformation:** Refactoring legacy MVC Controllers to strict REST APIs, returning standardized JSON responses instead of HTML views.
* **Modern Auth Patterns:** Replacing stateful session-based login with a stateless JWT architecture using **Spring Security 7**.
* **Database Modernization:** Utilizing **Neon.tech** for serverless PostgreSQL capabilities and branching workflows.
* **Type Safety:** Implementing end-to-end type safety from Backend DTOs to Frontend Zod schemas.
* **Performance:** Optimizing build times with **Vite** and data fetching strategies with **TanStack Query**.

## 🗺️ Migration Roadmap

- [x] **Phase 1: Foundation & Infrastructure**
    - Migrated codebase to Java 25.
    - Containerized database (PostgreSQL 18).
    - Established CI/CD pipelines with GitHub Actions.

- [ ] **Phase 2: Decoupling (Headless Shift)** (Active)
    - [x] Refactoring `ProductController` to REST API.
    - [ ] Removing Thymeleaf dependencies.
    - [ ] Implementing Global Exception Handling with Problem Details.

- [ ] **Phase 3: Security Overhaul**
    - [ ] Implementing JWT Authentication Filter.
    - [ ] Configuring Spring Security 7 SecurityFilterChain.

- [ ] **Phase 4: Client Implementation**
    - Initializing React 19 project with Vite.
    - Setting up Zustand stores and TanStack Query hooks.

## ⚡ Getting Started

### Prerequisites
* **JDK 25**
* **Node.js 22**
* **Docker** & Docker Compose
* IDE (IntelliJ IDEA recommended)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/darksilence1987/marketflex-v2.git](https://github.com/darksilence1987/marketflex-v2.git)
    cd marketflex-v2
    ```

2.  **Start the Database:**
    ```bash
    docker-compose up -d
    ```

3.  **Run the Backend:**
    ```bash
    ./gradlew bootRun
    ```

---

**Author:** Kaan Kara
* [Portfolio](https://kaankara.dev)
* [LinkedIn](https://linkedin.com/in/kaan-kara-b7975416)