# 🚀 beverage-order-flow-api

## 📌 Description

The **beverage-order-flow-api** is an API for managing resellers and beverage orders. Orders are stored in the API database and later sent to the distributor responsible for delivery.

The application follows **Clean Architecture**, ensuring modularity, scalability, and maintainability.

---

## 🛠 Technologies Used

The API leverages modern tools to ensure **performance, scalability, and reliability**:

- **Node.js** – JavaScript runtime environment.
- **TypeScript** – Superset of JavaScript with static typing.
- **Express.js** – Framework for building REST APIs.
- **Docker & Docker Compose** – Development and deployment containerization.
- **PostgreSQL** – Relational database for data storage.
- **Redis** – Caching layer for optimizing data retrieval.
- **RabbitMQ** – Messaging queue for asynchronous processing.
- **NGINX** – Load balancer for distributing API requests.
- **Prometheus + Grafana** – Monitoring and metrics collection.
- **Swagger** – API documentation.
- **Jest** – Unit testing framework.
- **K6** – Load testing tool.
- **express-rate-limit** – Rate limiting to prevent API abuse.
- **winston** – Structured logging.

---

## 📂 Architecture

The project follows **Clean Architecture**, ensuring clear separation of concerns:

📁 **src/**

- `application/` – **Facade layer**, responsible for exposing business logic.
- `domain/` – **Entities, business rules, and services**.
- `infra/` – External implementations such as **database, RabbitMQ, repositories, and external APIs**.
- `presentation/` – **Controllers and API routes**.
- `shared/` – **Utilities, exceptions, and logging**.

---

## 🚀 How to Run the Project

To run the application locally using **Docker**, follow these steps:

1️⃣ **Clone the repository:**

```bash
git clone https://github.com/devjunioralves/beverage-order-flow-api.git
cd beverage-order-flow-api
```

2️⃣ **Create a `.env` file with the required configurations:**

```bash
cp .env.example .env
```

3️⃣ **Start the application using Docker Compose:**

```bash
docker compose up -d api1 api2 nginx postgres rabbitmq prometheus grafana redis
```

The API will be available at `http://localhost:80`.

4️⃣ **(Optional) Run Load Testing**

```bash
docker compose up k6
```

This executes a **stress test** on the API using **K6**.

---

## 🧪 Running Tests

To execute **unit tests**, use:

```bash
npm run test
```

The tests will validate API functionality and generate a terminal report.

---

## 📌 API Endpoints

### **📍 Create a Beverage Order**

- **Endpoint:** `POST /api/v1/order`
- **Description:** Registers a new order and sends it for processing.
- **Example Request:**
  ```json
  {
    "resaleId": "c89ade09-46cd-49e1-b6f1-79f6947d1e9c",
    "customerId": "d4f90baf-8348-4111-a3e0-8c8abb9f6203",
    "items": [
      {
        "productId": "78910",
        "quantity": 900
      },
      {
        "productId": "111213",
        "quantity": 250
      }
    ]
  }
  ```
- **Possible Responses:**
  - ✅ `201 Created` – Order successfully registered.
  - ❌ `400 Bad Request` – Invalid data.
  - ❌ `500 Internal Server Error` – Unexpected error.

---

### **📍 Register a Reseller**

- **Endpoint:** `POST /api/v1/resale`
- **Description:** Registers a new reseller in the system.
- **Example Request:**
  ```json
  {
    "cnpj": "12.345.678/0001-99",
    "corporateName": "Revenda Client Ltda",
    "tradeName": "Revenda Client",
    "email": "contact@reseller.com",
    "phones": ["11999999999", "11888888888"],
    "contacts": [
      { "name": "John Doe", "isPrimary": true },
      { "name": "Jane Smith", "isPrimary": false }
    ],
    "deliveryAddresses": ["123 Example Street", "456 Main Avenue"]
  }
  ```
- **Possible Responses:**
  - ✅ `201 Created` – Reseller successfully registered.
  - ❌ `400 Bad Request` – Validation error.
  - ❌ `500 Internal Server Error` – Unexpected error.

---

## 📊 Monitoring & Observability

The API includes a **comprehensive observability system**, utilizing:

- **📡 Prometheus** – Collects API performance metrics.
- **📊 Grafana** – Provides real-time visual dashboards.
- **📜 Winston** – Structured logging for error tracking.
- **⏳ express-rate-limit** – Protection against request abuse.

Monitoring interfaces:

- 🔍 **Prometheus:** `http://localhost:9090`
- 📊 **Grafana:** `http://localhost:3001` (Default login: admin/admin)

---

## 🏗 Scalability Strategy

To ensure **high availability** and support **high traffic loads**, the API implements:

✔ **Load balancing** using **NGINX** across multiple API instances.\
✔ **Asynchronous messaging** with **RabbitMQ**, preventing order loss.\
✔ **Caching with Redis** for optimized query performance.\
✔ **Continuous monitoring** via **Prometheus + Grafana**.\
✔ **K6 load testing** to evaluate API throughput.

---

## Areas for Improvement (Summary)

While the API follows scalable architecture and best practices, some enhancements can be made:

- Integration Tests: Adding integration tests to validate full request-response cycles.
- Autoscaling: Replacing NGINX-based load balancing with Kubernetes for auto-scaling.
- CI/CD: Automating testing and deployment with GitHub Actions or GitLab CI/CD.
- Observability: Improving tracing with OpenTelemetry for better issue diagnosis.

---

## 📌 License

This project is licensed under the **MIT License**.

📧 **Contact:** Wanderley Trindade (**Junior Trindade**)

---
