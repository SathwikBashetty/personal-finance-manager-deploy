Personal Finance Manager

A full-stack web application to manage personal finances by tracking income and expenses. The app provides a clean dashboard, filters, and visual insights to help users stay on top of their money.

🚀 Features

User Authentication (JWT-based secure login & signup)

Add Income & Expenses with categories and notes

Dashboard Overview showing:

Total Income

Total Expenses

Current Balance

Date Filtering (Daily, Monthly, Yearly)

Transaction History with search & pagination

Charts & Graphs for spending analysis

Secure Data Management – user-specific records

Responsive UI for mobile and desktop

🛠️ Tech Stack
Frontend

React.js

Tailwind CSS / Custom CSS

Chart.js / Recharts (for data visualization)

Backend

Spring Boot (Java)

JWT Authentication & Authorization

REST APIs

Database

MySQL

📂 Project Structure
Personal-Finance-Manager/
│
├── frontend/          # React.js code
│   ├── components/    # Dashboard, Forms, Charts
│   ├── pages/         # Login, Signup, History
│   └── ...
│
├── backend/           # Spring Boot code
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── ...
│
└── database/          # SQL scripts

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/personal-finance-manager.git
cd personal-finance-manager

2. Backend Setup (Spring Boot + MySQL)

Configure application.properties with your MySQL credentials.

Run the backend server:

./mvnw spring-boot:run

3. Frontend Setup (React)
cd frontend
npm install
npm start


The app will be available at:
👉 Frontend: http://localhost:3000
👉 Backend: http://localhost:8080

📊 Future Enhancements
Email Verification & Password Reset
AI-based Spending Suggestions
Export Data as PDF/Excel
Deployment on Cloud (AWS / Render / Vercel)
🤝 Contributing
Contributions are welcome! Please fork the repo and create a pull request for review.
📜 License
This project is licensed under the MIT License – free to use and modify.
