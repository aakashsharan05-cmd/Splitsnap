# SplitSnap 💸

**Split expenses. Track balances. Settle up with ease.**

SplitSnap is a full-stack expense-sharing application designed to help groups manage shared expenses, understand who owes whom, and record settlements. It also includes an AI-powered receipt-scanning workflow to help extract expense details from receipt images.

> **Project status:** In development. Some features and integrations may still require testing or completion.

## ✨ Features

- **Authentication** — User registration and login with password hashing and JWT-based authentication.
- **Group management** — Create groups and manage group membership.
- **Expense tracking** — Add expenses to a group and associate them with the person who paid.
- **Flexible expense splitting** — Supports equal, exact-amount, and percentage-based split types in the backend.
- **Balance calculation** — Calculate each member's net balance from group expenses and recorded settlements.
- **Settlement workflow** — View suggested payments and record payments, including partial payments as the workflow is completed.
- **Receipt scanning (AI)** — Upload receipt images and extract expense details using a vision-capable AI API.
- **Responsive interface** — React-based UI styled with Tailwind CSS.

Feature availability can vary while development is ongoing. Check the current implementation before relying on any feature in production.

## 🧰 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- Multer for file uploads
- ImageKit for image hosting
- Google Gemini API for receipt analysis

## 🏗️ Architecture

```text
React + Vite frontend
        |
        | HTTP requests + JWT
        v
Node.js + Express API
        |
        +---- MongoDB / Mongoose
        |
        +---- ImageKit (receipt image storage)
        |
        +---- Gemini API (receipt extraction)
```

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Node.js (LTS recommended)
- npm
- MongoDB database (local or MongoDB Atlas)
- ImageKit account and API credentials, if using receipt uploads
- Google Gemini API key, if using AI receipt extraction

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Replace the placeholders with your repository URL and folder name.

### 2. Configure the backend

Open the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory. Add the variable names expected by your implementation, for example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**Important:** These are example names. Make sure they match the names read by your actual backend code. Do not commit `.env` or real credentials to GitHub.

Start the backend using the script configured in your `package.json`. For example, if your development script is `dev`:

```bash
npm run dev
```

### 3. Configure the frontend

In a new terminal, open the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL in the terminal. Open that URL in your browser.

If your frontend uses a hard-coded API URL, update it to your backend address. For a more maintainable setup, configure the API base URL through a Vite environment variable, such as `VITE_API_BASE_URL`, and read it with `import.meta.env.VITE_API_BASE_URL`.

> The directory names and environment variable names above are examples. Adjust them to match the structure and configuration in your repository.

## 🔌 API Overview

The following routes reflect the current planned/implemented API structure. Confirm each route in your code before publishing this list as a guarantee.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/groups` | Create a group |
| `GET` | `/api/groups` | Get the current user's groups |
| `GET` | `/api/groups/:groupId` | Get group details |
| `POST` | `/api/groups/:groupId/members` | Add a member to a group |
| `GET` | `/api/groups/:groupId/members` | List group members |
| `GET` | `/api/groups/:groupId/balance` | Get group balances |
| `POST` | `/api/expenses/:groupId` | Create a group expense |
| `GET` | `/api/expenses/:groupId` | List group expenses |
| `POST` | `/api/settlements/:groupId` | Record a settlement |
| `POST` | `/api/receipts/upload` | Upload and process a receipt |

Authenticated routes require a valid JWT in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

## 🧮 Expense Splitting

SplitSnap's backend supports three split types:

- **Equal split** — Divide an expense evenly among the selected participants.
- **Exact split** — Assign a specific amount to each participant.
- **Percentage split** — Assign a percentage of the expense to each participant.

The total of exact amounts should equal the expense amount, and percentage splits should total 100%. Currency rounding and participant validation should be tested carefully.

## 🔐 Security Notes

- Passwords are hashed before storage.
- Protected API routes use JWT authentication.
- Keep API keys, database credentials, and JWT secrets in environment variables.
- Validate group membership and authorization on the server for every protected operation.
- Validate expense amounts, split totals, uploaded files, and settlement amounts on the backend.
- Never trust client-submitted balances or use frontend calculations as the source of truth for financial validation.

## 🗺️ Roadmap

- [ ] Finish and test partial settlement handling and outstanding-balance validation.
- [ ] Reuse balance-calculation logic through a shared service.
- [ ] Complete end-to-end testing of all frontend and backend workflows.
- [ ] Finish receipt parsing and review extracted values before saving expenses.
- [ ] Add expense analytics and monthly/category charts.
- [ ] Implement group-specific balance threshold email alerts.
- [ ] Improve loading, empty, and error states.
- [ ] Deploy the frontend and backend.
- [ ] Add screenshots or a short demo to this README.

## 🧪 Testing Checklist

Before using the app with real data, test at least:

- Registration, login, and invalid credentials.
- Requests with missing or invalid JWTs.
- Attempts to access groups without membership.
- Equal, exact, and percentage split calculations.
- Decimal currency amounts and rounding.
- Settlement amounts that are zero, negative, invalid, or greater than the outstanding debt.
- Partial payments and the resulting remaining balance.
- Invalid or oversized receipt uploads.
- Missing or unavailable third-party API credentials.

## 🤝 Contributing

This is a learning and portfolio project. Suggestions, bug reports, and improvements are welcome. If you contribute, please describe the change and include steps to reproduce or test it.

## 📄 License

No license has been specified yet. Add a `LICENSE` file before presenting this repository as open source.

---

**Built as a full-stack learning project with React, Node.js, Express, MongoDB, and AI-powered receipt processing.**
