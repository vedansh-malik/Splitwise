#  SplitwisePro

> **Smart expense sharing for groups, powered by AI.**
> Effortlessly track bills, split costs, and settle debts with an optimized algorithm that minimizes the number of transactions.

![Project Banner](https://github.com/vedansh-malik/Splitwise/blob/d8b0e31bf7aa2279902b3c918c7cca88b5501413/report/Screenshot%202026-01-21%20224150.png)

##  Screenshots

| **Dashboard (Desktop)** | **Mobile View** |
|:---:|:---:|
| ![Dashboard](https://github.com/vedansh-malik/Splitwise/blob/d8b0e31bf7aa2279902b3c918c7cca88b5501413/report/Screenshot%202026-01-21%20224150.png) | ![Mobile](https://github.com/vedansh-malik/Splitwise/blob/d8b0e31bf7aa2279902b3c918c7cca88b5501413/report/WhatsApp%20Image%202026-01-21%20at%2022.41.19.jpeg) |

| **Group Expense Management** | **AI Financial Assistant** |
|:---:|:---:|
| ![Group View](https://github.com/vedansh-malik/Splitwise/blob/d8b0e31bf7aa2279902b3c918c7cca88b5501413/report/Screenshot%202026-01-21%20222514.png) | ![AI Chat](https://github.com/vedansh-malik/Splitwise/blob/d8b0e31bf7aa2279902b3c918c7cca88b5501413/report/Screenshot%202026-01-21%20223020.png) |

---

##  Key Features

- **🔐 Secure Authentication:** Full Login/Signup system using JWT (JSON Web Tokens).
- **👥 Group Management:** Create groups and add members to start tracking shared costs.
- **➗ Flexible Splitting Options:**
  - **Equal Split:** Automatically divides cost equally among members.
  - **Exact Amounts:** Specify exactly who owes what.
  - **Percentage Split:** Split bills by percentage (auto-validation ensures it equals 100%).
- **🧠 Fin-AI Assistant:** Integrated **Google Gemini AI** to answer questions like _"Who owes me money?"_ or summarize financial status.
- **📉 Optimized Debt Algorithm:** Reduces the number of transactions needed to settle up. (e.g., If A owes B $10, and B owes C $10, the system tells A to pay C $10 directly).
- **📧 Email Notifications:** Automated email alerts sent to members when a new expense is added.
- **🎨 Responsive "Dark Mode" UI:** A custom Matte Smoke & Burnt Orange theme that looks great on all devices.

---

##  Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios (for API requests)
- Lucide React (Icons)
- Custom CSS (Responsive & Glassmorphism effects)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- Google Generative AI SDK (Gemini)
- Nodemailer (Email Service)

---

##  Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/splitwisepro.git](https://github.com/your-username/splitwisepro.git)
cd splitwisepro
```
2. Backend Setup
Navigate to the backend folder and install dependencies:

```Bash

cd backend
npm install
```

Create a .env file in the backend directory:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
# Optional: Email Credentials
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
Start the server:
```
```Bash

npm start
# Server running on port 5000
# MongoDB Connected
```
3. Frontend Setup
Navigate to the frontend folder (root or src) and install dependencies:

```Bash

cd ../frontend  # (Or just 'cd ..' if your frontend is in the root)
npm install
```
Start the React app:

```Bash
npm start
```
##  API Documentation

### **Authentication**
* **POST** `/api/auth/signup` - Register a new user
* **POST** `/api/auth/login` - Login and receive a JWT token

### **Groups**
* **GET** `/api/groups` - Get all groups for the current user
* **POST** `/api/groups` - Create a new group
* **GET** `/api/groups/:id` - Get group details and expenses
* **GET** `/api/groups/:id/balances` - **Get optimized debt settlements**

### **Expenses**
* **POST** `/api/expenses` - Add a new expense (triggers email notification)
* **PUT** `/api/expenses/:id` - Update an existing expense
* **DELETE** `/api/expenses/:id` - Remove an expense
* **GET** `/api/expenses/balances` - Get global balances for the logged-in user

### **AI Chat**
* **POST** `/api/chat` - Ask the Fin-AI assistant a question about your dashboard

---

##  Contributing

Contributions are welcome! Please follow these steps:

* **Fork** the repository.
* **Create** your feature branch: `git checkout -b feature/AmazingFeature`.
* **Commit** your changes: `git commit -m 'Add some AmazingFeature'`.
* **Push** to the branch: `git push origin feature/AmazingFeature`.
* **Open** a Pull Request.
