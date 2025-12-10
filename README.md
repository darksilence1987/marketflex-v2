# MarketFlex v2 - Modern E-Commerce Platform

**Status:** Active Development | **Architecture:** Full-Stack Headless E-Commerce

## 📄 Project Overview

MarketFlex v2 is a modern, multi-vendor e-commerce platform built with a headless architecture. Originally migrated from a monolithic server-side rendered application, this project now features a fully decoupled REST API backend with a reactive React frontend.

The platform supports multi-tenancy for vendors, complete order management, shopping cart functionality, user authentication, and a comprehensive dashboard system for both customers and vendors.

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 25 (Preview Features) | Core Language |
| Spring Boot | 4.0.0 | Application Framework |
| Spring Security | 7.x | JWT Authentication & RBAC |
| PostgreSQL | 18.x | Primary Database |
| Flyway | Latest | Database Migrations |
| Caffeine | 3.1.8 | Caching Layer |
| SpringDoc OpenAPI | 2.8.8 | API Documentation |
| Gradle | 9.x | Build Tool |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool & Dev Server |
| TypeScript | 5.9.3 | Type Safety |
| Tailwind CSS | 4.1.17 | Styling |
| Zustand | 5.0.9 | Global State Management |
| TanStack Query | 5.90.12 | Server State & Caching |
| React Hook Form | 7.68.0 | Form Handling |
| Zod | 4.1.13 | Schema Validation |
| React Router | 7.10.1 | Client-Side Routing |

## 🏗️ Architecture

```
marketflex-v2/
├── backend/                    # Spring Boot REST API
│   └── src/main/java/org/xhite/marketflex/
│       ├── config/            # Application configuration
│       ├── controller/        # REST API endpoints
│       ├── dto/               # Data Transfer Objects (Java Records)
│       ├── exception/         # Global exception handling
│       ├── mapper/            # Entity ↔ DTO mappers
│       ├── model/             # JPA entities
│       ├── repository/        # Data access layer
│       ├── security/          # JWT & Spring Security
│       └── service/           # Business logic
└── client/                     # React SPA
    └── src/
        ├── components/        # Reusable UI components
        ├── context/           # React context providers
        ├── hooks/             # Custom React hooks
        ├── lib/               # Utility libraries
        ├── pages/             # Route-based page components
        └── store/             # Zustand state stores
```

## 🚀 Features

### Implemented ✓
- **Authentication System**
  - JWT-based stateless authentication
  - User registration & login
  - Role-Based Access Control (User, Vendor, Admin)
  - Profile management with address updates

- **Product Catalog**
  - Product listing with filtering
  - Category management
  - Product detail pages
  - Featured products display

- **Shopping Experience**
  - Shopping cart management
  - Wishlist functionality
  - Favourite vendors
  - Vendor store pages

- **Order Management**
  - Full checkout flow
  - Order history tracking
  - Order success confirmation
  - Vendor order management

- **Vendor System**
  - Multi-vendor support
  - Vendor dashboard
  - Store settings management
  - Vendor-specific order tracking

- **User Dashboard**
  - Account profile settings
  - Order history
  - Responsive layout with navigation

### API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `PUT /api/v1/auth/profile` |
| **Products** | `GET /api/v1/products`, `GET /api/v1/products/{id}`, `POST /api/v1/products` |
| **Categories** | `GET /api/v1/categories`, `POST /api/v1/categories` |
| **Cart** | `GET /api/v1/cart`, `POST /api/v1/cart`, `DELETE /api/v1/cart/{id}` |
| **Orders** | `POST /api/v1/orders/checkout`, `GET /api/v1/orders`, `GET /api/v1/orders/{id}` |
| **Vendors** | `GET /api/v1/vendors/all`, `GET /api/v1/vendors/{id}`, `GET /api/v1/vendors/orders` |

## 🗺️ Migration Roadmap

- [x] **Phase 1: Foundation & Infrastructure**
    - Migrated codebase to Java 25
    - Containerized database (PostgreSQL 18)
    - Established CI/CD pipelines with GitHub Actions

- [x] **Phase 2: Decoupling (Headless Shift)**
    - Refactored all Controllers to REST APIs
    - Removed Thymeleaf dependencies
    - Implemented DTOs as Java Records
    - Global Exception Handling

- [x] **Phase 3: Security Overhaul**
    - Implemented JWT Authentication Filter
    - Configured Spring Security 7 SecurityFilterChain
    - Role-Based Access Control (RBAC)

- [x] **Phase 4: Client Implementation**
    - Initialized React 19 project with Vite
    - Set up Zustand stores (auth, cart, UI)
    - Implemented TanStack Query for data fetching
    - Built comprehensive page structure

- [ ] **Phase 5: Feature Enhancements** (Current)
    - [ ] Product reviews & ratings
    - [ ] Advanced search with Elasticsearch
    - [ ] Payment gateway integration
    - [ ] Email notifications
    - [ ] Admin dashboard

## ⚡ Getting Started

### Prerequisites
* **JDK 25** (with preview features)
* **Node.js 22+**
* **Docker** & Docker Compose
* IDE (IntelliJ IDEA recommended)

### Local Development

1. **Clone the repository:**
    ```bash
    git clone https://github.com/darksilence1987/marketflex-v2.git
    cd marketflex-v2
    ```

2. **Start the Database:**
    ```bash
    docker-compose up -d
    ```

3. **Run the Backend:**
    ```bash
    cd backend
    ./gradlew bootRun
    ```
    Backend API will be available at `http://localhost:8080`
    
    API Documentation: `http://localhost:8080/swagger-ui.html`

4. **Run the Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Frontend will be available at `http://localhost:5173`

### Environment Configuration

Create a `.env` file or configure `application.properties` with:
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/marketflex
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Or build images separately
docker build -t marketflex-backend ./backend
docker build -t marketflex-client ./client
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Author:** Kaan Kara
* [Portfolio](https://kaankara.dev)
* [LinkedIn](https://linkedin.com/in/kaan-kara-b7975416)