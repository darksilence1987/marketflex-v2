# MarketFlex - E-Commerce Platform Modernization Journey 🚀

> **Status:** Active Development | **Phase:** Legacy to Modern Migration
> **Current Stack:** Java 25 (LTS) & Spring Boot 4.0.0 (Snapshot)

## 📖 Project Overview

**MarketFlex** originally started as a traditional monolithic e-commerce application built with Java 21 and Spring Boot 3.x using server-side rendering (Thymeleaf).

This repository represents the **next evolution** of the project. We are currently in the process of a comprehensive **Architectural Migration** to transform this monolith into a high-performance, headless, and cloud-native solution.

### 🎯 The "War Room" Mission (Modernization Goals)

We are refactoring the entire codebase to meet **2026 Industry Standards**:

* **☕ Java 25 & Spring Boot 4:** Leveraging the latest language features (Records, Sealed Classes, Virtual Threads) and framework capabilities.
* **🔌 Headless Architecture:** Decoupling the frontend completely. Moving from Thymeleaf to a **RESTful API** backend consumed by a modern **React/Next.js** frontend.
* **🏗️ Microservices Transition:** Identifying core domains (Payment, Notification, Inventory) to extract them into independent, scalable microservices using **Abstract Factory** and **Strategy** patterns.
* **🚀 Cloud Native:** Dockerizing the application for seamless deployment on **Google Cloud Run** with CI/CD pipelines via GitHub Actions.
* **🛡️ Enterprise Grade Security:** Implementing robust JWT authentication and Role-Based Access Control (RBAC).

---

## 🛠️ Tech Stack & Architecture

### Backend (Core)
* **Language:** Java 25 (Preview Features Enabled)
* **Framework:** Spring Boot 4.0.0 (Snapshot/M1)
* **Database:** PostgreSQL 18 (Dockerized)
* **Security:** Spring Security 7 + JWT
* **Build Tool:** Gradle 9.x

### Infrastructure & DevOps
* **Containerization:** Docker (Multi-stage builds)
* **Cloud Provider:** Google Cloud Platform (Cloud Run)
* **CI/CD:** GitHub Actions
* **DNS & Security:** Cloudflare

### Frontend (Future State)
| Requirement | Technology                        | Why? |
| :--- |:----------------------------------| :--- |
| **UI Library** | **React 19.2 + Tailwind CSS 4.x** | Highly customizable and utility-first CSS framework. |
| **Data Fetching (API)** | **TanStack Query v5**             | Unrivaled for managing Cache, Retry, and Loading states. |
| **Global State** | **Zustand**                       | The fastest solution for Cart and Sidebar management. |
| **Form Management** | **React Hook Form**               | Render optimization for forms (e.g., Login, Add Product). |
| **Validation** | **Zod**                           | Schema validation that is 100% compatible with TypeScript. |
| **Framework** | **Vite**                          | Create-React-App is dead. Offers millisecond compilation speeds. |

---

## 🗺️ Roadmap: From Monolith to Microservices

We are executing a **"Strangler Fig"** migration strategy:

- [x] **Phase 1: Foundation Upgrade** (✅ Completed)
    - Upgrade to Java 25 and Spring Boot 4.0.0.
    - Dockerize the database (PostgreSQL 18).
    - Establish CI/CD pipelines.

- [ ] **Phase 2: Decoupling (The Headless Shift)** (🚧 In Progress)
    - Remove Thymeleaf dependencies.
    - Refactor Controllers to return `ResponseEntity` (JSON) instead of Views.
    - Implement comprehensive DTO patterns using Java `Records`.

- [ ] **Phase 3: Frontend Revolution**
    - Develop a separate Admin Dashboard using **React + Tailwind CSS**.
    - Implement a high-performance Storefront.

- [ ] **Phase 4: Domain Decomposition**
    - Extract **Payment Service** (Implementing Abstract Factory Pattern).
    - Extract **Notification Service** (Async processing).

---

## ⚡ Getting Started

### Prerequisites
* JDK 25
* Docker & Docker Compose
* Node.js 22.x (for future frontend work)
* IntelliJ IDEA (Recommended)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/darksilence1987/marketflex-v2.git](https://github.com/darksilence1987/marketflex-v2.git)
    cd marketflex-v2
    ```

2.  **Start the Database (Docker):**
    ```bash
    # Starts PostgreSQL 18 and pgAdmin
    docker-compose up -d
    ```

3.  **Build & Run:**
    ```bash
    ./gradlew bootRun
    ```

---

## 👨‍💻 Author

**Kaan Kara**
*Backend Software Engineer & System Architect*

* **Portfolio:** [kaankara.dev](https://kaankara.dev)
* **Focus:** Modernizing legacy systems, Java Ecosystem, Cloud Architecture.

---

*This project is a living case study for migrating legacy Java applications to the cutting-edge Spring ecosystem.*