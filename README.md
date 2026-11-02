# 💸 SplitSnap — AI-Powered Expense Splitting

<p align="center">
  <strong>Split expenses. Stay even. Keep it simple.</strong><br/>
  <a href="https://splitsnap-1.onrender.com">🚀 Live Demo</a>
</p>

## 🌐 Live Demo
**Frontend:** https://splitsnap-1.onrender.com

> The app is hosted on Render's free tier; the first visit may take a little time while the service wakes up.

## 📸 Screenshots

### Login
![SplitSnap Login](screenshots/login.png)

### Dashboard
![SplitSnap Dashboard](screenshots/dashboard.png)

### Group Balances
![Group balances and members](screenshots/group-balances.png)

### Expenses
![Expenses list](screenshots/expenses-list.png)

### Add Expense
![Add expense form](screenshots/add-expense.png)

### Choose Participants
![Choose participants for an expense](screenshots/choose-members.png)

### Settlement
![Settlement screen](screenshots/settlement.png)

## ✨ Features
- 🔐 User registration and login
- 👥 Create groups and manage group members
- 💸 Add, edit, and delete group expenses
- ⚖️ Equal, percentage, and exact expense splits
- 📊 View group balances and track who owes whom
- 🤝 Suggested settlements to reduce the number of transactions
- 🤖 AI-powered receipt scanning to help extract expense details
- 🧾 Expense categories (Food, Shopping, Transit, Stay, Fun, Miscellaneous)
- 🔔 Group-level balance alert threshold

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| AI | Google Gemini |
| Image hosting | ImageKit |
| Deployment | Render |

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SplitSnap
```

### 2. Start backend
```bash
cd Backend
npm install
npm run dev
```
Configure the backend `.env` with the MongoDB connection string, JWT secret, and any API credentials needed. **Never commit secrets or `.env` files.**

### 3. Start frontend (in a separate terminal)
```bash
cd Frontend
npm install
npm run dev
```
Set `Frontend/.env` with your local backend API URL:
```env
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```
Replace the placeholder with the port configured in your backend.

## 📂 Project Structure
```text
SplitSnap/
├── Frontend/
└── Backend/
```

## 🎯 About
SplitSnap is a full-stack portfolio project demonstrating group expense-sharing workflows, REST API development, database-backed user/group management, and AI-assisted receipt processing.

## 👨‍💻 Author
Built as a full-stack portfolio project.

---
<p align="center">Made with ❤️ to make group expenses easier.</p>
