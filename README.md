## Features

- User Authentication (JWT-based secure login & signup)
- Add Income & Expenses with categories and notes
- Dashboard Overview showing:
    - Total Income
    - Total Expenses
    - Current Balance
- Date Filtering (Daily, Monthly, Yearly)
- Transaction History with search & pagination
- Charts & Graphs for spending analysis
- Secure Data Management – user-specific records
- Responsive UI for mobile and desktop

## Tech Stack
### Frontend
- React.js
- Tailwind CSS / Custom CSS
- Chart.js / Recharts (for data visualization)
### Backend
- Spring Boot (Java)
- JWT Authentication & Authorization
- REST APIs
### Database
- MySQL

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

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/personal-finance-manager.git
cd personal-finance-manager

```

### 2. Backend Setup (Spring Boot + MySQL)

- Configure `application.properties` with your MySQL credentials.
- Run the backend server:

```bash
./mvnw spring-boot:run

```

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start

```
### 4.Database Setup (MySQL) 

- Open the SQL file in the database/ folder.
- Copy the contents and paste it into MySQL Workbench.
- Run/compile the script to create the database and tables.
- After that, start the backend and frontend as usual.


The app will be available at:

👉 Frontend: `http://localhost:3000`

👉 Backend: `http://localhost:8080`

##  Future Enhancements

- Email Verification & Password Reset
- AI-based Spending Suggestions
- Export Data as PDF/Excel
- Deployment on Cloud (AWS / Render / Vercel)
