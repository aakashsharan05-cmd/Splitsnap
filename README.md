# SplitSnap 💸

**Split expenses. Track balances. Settle up with ease.**

SplitSnap is a full-stack expense-sharing application that helps friends, roommates, and groups manage shared expenses, track balances, and settle debts easily.

It also includes an AI-powered receipt scanning feature that extracts expense information from uploaded receipt images, reducing manual data entry.

## ✨ Features

- **User Authentication** – Secure registration and login using JWT authentication and bcrypt password hashing.
- **Group Management** – Create groups, view group details, and add members.
- **Expense Management** – Add and track expenses within groups.
- **Flexible Expense Splitting**
  - Equal split
  - Exact amount split
  - Percentage-based split
- **Balance Calculation** – Calculate how much each group member owes or is owed.
- **Settlement Management** – Record payments and manage outstanding balances.
- **AI Receipt Scanning** – Extract merchant name, total amount, date, category, and purchased items from receipt images using Google Gemini.
- **Image Uploads** – Store receipt images using ImageKit.
- **Responsive UI** – Built with React and Tailwind CSS.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS 4 |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| File Upload | Multer |
| Image Storage | ImageKit |
| AI Integration | Google Gemini API |
| Icons | Lucide React |

## 🏗️ Project Architecture

```text
SplitSnap/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   │
│   └── package.json
│
└── README.md
```

### Application Flow

```text
React Frontend
      |
      | HTTP Requests + JWT
      v
Express.js Backend
      |
      ├── Authentication
      ├── Group Management
      ├── Expense Management
      ├── Balance Calculation
      ├── Settlement Management
      |
      ├── MongoDB
      |
      ├── ImageKit
      |
      └── Google Gemini API
             |
             v
       Receipt Extraction
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS recommended)
- npm
- MongoDB (local installation or MongoDB Atlas)
- ImageKit account
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/aakashsharan05-cmd/Splitsnap.git

cd Splitsnap
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Replace the placeholder values with your credentials. Ensure the environment variable names match your backend implementation.

Start the backend server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## 🔌 API Endpoints

All protected endpoints require a valid JWT token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/groups` | Create a group |
| GET | `/api/groups` | Get user's groups |
| GET | `/api/groups/:groupId` | Get group details |
| PATCH | `/api/groups/:groupId` | Update group |
| POST | `/api/groups/:groupId/members` | Add a group member |
| GET | `/api/groups/:groupId/members` | Get group members |
| GET | `/api/groups/:groupId/balance` | Get group balances |
| POST | `/api/expenses/:groupId` | Create an expense |
| GET | `/api/expenses/:groupId` | Get group expenses |
| POST | `/api/settlements/:groupId` | Record a settlement |
| POST | `/api/receipts/upload` | Upload and scan a receipt |

Authentication header:

```http
Authorization: Bearer <JWT_TOKEN>
```

## 🧮 Expense Splitting Logic

SplitSnap supports three types of expense splitting.

**1. Equal Split**

Divides the expense equally among selected group members.

Example: ₹900 shared by 3 members = ₹300 each.

**2. Exact Amount Split**

Allows users to assign specific amounts to individual members.

Example:
- Member A: ₹400
- Member B: ₹300
- Member C: ₹200

**3. Percentage Split**

Divides expenses according to user-defined percentages.

Example:
- Member A: 50%
- Member B: 30%
- Member C: 20%

The backend validates split totals and group membership.

## 🤖 AI-Powered Receipt Scanning

SplitSnap integrates Google Gemini to extract structured information from receipt images.

### How it works

1. User uploads a receipt image.
2. Backend receives the image using Multer.
3. ImageKit stores the uploaded image.
4. Google Gemini analyzes the receipt.
5. Structured JSON data is extracted.
6. Extracted expense details are returned to the frontend for review.

### Extracted Information

- Merchant name
- Total amount
- Transaction date
- Expense category
- Purchased items and their amounts

This feature reduces manual expense entry and makes expense creation easier.

## 🔐 Security

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API routes.
- Backend validation for expense amounts and split calculations.
- Group membership verification.
- Environment variables for sensitive credentials.

**Never commit `.env` files, API keys, JWT secrets, or database credentials to GitHub.**

## 🗺️ Future Improvements

- Expense analytics dashboard.
- Monthly and category-wise spending charts.
- Member-wise spending analysis.
- Group-specific balance threshold email alerts.
- Improved receipt extraction accuracy.
- Production deployment.
- Automated backend and frontend testing.

## 👨‍💻 Author

**Aakash Sharan**

- GitHub: [@aakashsharan05-cmd](https://github.com/aakashsharan05-cmd)

---

Built with React, Node.js, Express, MongoDB, and Google Gemini.

**Split smarter. Settle easier. 💸**