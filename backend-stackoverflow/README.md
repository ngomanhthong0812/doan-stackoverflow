# BackEnd_Stackoverflow

### ✅ CI Status  
[![CI](https://github.com/Benlaptrinh/BackEnd_Stackoverflow/actions/workflows/main.yml/badge.svg)](https://github.com/Benlaptrinh/BackEnd_Stackoverflow/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/Benlaptrinh/backend-stackoverflow/branch/main/graph/badge.svg)](https://codecov.io/gh/Benlaptrinh/backend-stackoverflow)
![Node.js](https://img.shields.io/badge/node-18-green)
![License](https://img.shields.io/badge/license-MIT-blue)

📌 A scalable backend API that mimics StackOverflow — built with Node.js, Express, MongoDB, Socket.IO, and Redis.

---

## 📚 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- 🔐 **Authentication** (JWT + OAuth Google/GitHub)
- 📝 **Ask & answer questions** with Markdown + code + images
- 💬 **Nested comments** with like system
- 🗳 **Voting, tags, folders, following**
- 📩 **Real-time + stored notifications** (Socket.IO + MongoDB)
- ⚠️ **Report & moderation** system with admin approval
- 📈 **Leaderboard + profile reputation**
- ⚡ **Smart Caching with Redis** for leaderboard, popular tags, user profiles, and search results
- 🧩 Modular MVC architecture with clear separation of concerns

---

## 📸 Screenshots

| Ask Question Flow | Real-time Notification |
|-------------------|------------------------|
| ![Ask Screenshot](https://github.com/user-attachments/assets/f3b9d37a-f53c-49f0-ba8b-85e9d226f5b3) | ![Noti Screenshot](https://github.com/user-attachments/assets/d895b228-8d21-435f-b4f4-9411b022f646) |

---

## 🧪 Testing

- ✅ Unit tests with **Jest**
- 🔄 Integration tests with **Supertest**
- 📊 Test coverage tracked via **Codecov**
- 🧪 Mocking database using **MongoMemoryServer**

---

## 🧰 Tech Stack

| Layer        | Tech                    |
|--------------|-------------------------|
| Backend      | Node.js, Express        |
| Database     | MongoDB + Mongoose      |
| Caching      | Redis                   |
| Auth         | JWT + Passport (OAuth2) |
| Realtime     | Socket.IO               |
| Upload       | Cloudinary              |
| Email        | Nodemailer              |
| CI/CD        | GitHub Actions          |
| Testing      | Jest + Supertest        |

---

## 📁 Project Structure

```bash
├── controllers/       # Route handlers
├── services/          # Business logic
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middlewares/       # JWT, error, rate-limit, upload
├── sockets/           # Socket.IO logic
├── utils/             # Email, validation, token, redis
├── tests/             # Jest + Supertest
└── .github/workflows/ # CI/CD configs


## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Benlaptrinh/BackEnd_Stackoverflow.git
cd BackEnd_Stackoverflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start Redis (Docker)
docker run -d --name redis-server -p 6379:6379 redis

# Run the development server
npm run dev

# Run unit & integration tests
npm test

# Run tests with coverage report
npm run test -- --coverage
