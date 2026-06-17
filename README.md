AI Financial Advisor for Gen Z
Project Overview

AI Financial Advisor for Gen Z is an intelligent personal finance management platform designed to help young individuals make smarter financial decisions. The platform uses Artificial Intelligence, Machine Learning, and Large Language Models (LLMs) to analyze spending habits, track income and expenses, generate personalized financial insights, create savings plans, and provide investment guidance.

The system acts as a virtual financial coach that helps users understand where their money goes, identify unnecessary expenses, improve budgeting habits, and achieve financial goals through data-driven recommendations.

Core Features
1. User Authentication & Profile Management
Secure user registration and login
JWT-based authentication
User profile management
Financial goal setup
Income source management
Risk appetite assessment
2. Expense Tracking
Add income and expenses manually
Categorize transactions automatically
Expense history management
Monthly and yearly spending reports
Transaction search and filtering
Recurring expense tracking
Categories
Food & Dining
Transportation
Shopping
Entertainment
Healthcare
Education
Utilities
Investments
Miscellaneous
3. AI-Powered Spending Analysis

The AI engine analyzes:

Spending patterns
Income trends
Savings behavior
Lifestyle expenses
Unnecessary expenditures
Insights Generated
Top spending categories
Overspending alerts
Monthly financial health score
Expense trend analysis
Personalized cost-cutting suggestions
4. Smart Budget Planner

Users can:

Create monthly budgets
Set spending limits
Allocate funds by category
Monitor budget utilization
AI Recommendations
Recommended budget allocation
Dynamic budget adjustments
Budget optimization suggestions
5. Savings Goal Management

Users can create goals such as:

Emergency Fund
New Laptop
Car Purchase
Higher Education
Vacation Planning
Features
Goal tracking
Progress visualization
AI-generated savings strategy
Time-to-goal estimation
6. AI Financial Chatbot

Built using LLMs and RAG.

Example Queries
How can I save ₹5,000 this month?
Am I overspending on food?
Suggest an investment plan for beginners.
How much should I save every month?
Explain SIP investments.
Features
Natural language interaction
Personalized responses
Financial education support
Budget recommendations
Investment guidance
7. Investment Recommendation Engine

Based on:

User age
Income
Risk tolerance
Savings goals
Recommendations
Fixed Deposits
Mutual Funds
SIPs
ETFs
Stocks
Emergency Funds
AI Analysis
Risk assessment
Diversification suggestions
Goal-based investment plans
8. Financial Health Score

The system calculates a financial score using:

Savings ratio
Expense ratio
Debt ratio
Investment ratio
Budget discipline
Output
Score from 0–100
Personalized improvement suggestions
9. Expense Forecasting

Using Machine Learning models:

Predict future expenses
Estimate monthly cash flow
Detect unusual spending behavior
Forecast savings growth
10. Interactive Dashboard
Visualizations
Expense Pie Charts
Income vs Expense Graphs
Monthly Trend Analysis
Savings Progress Charts
Budget Utilization Reports
Financial Health Score Cards
11. AI Alerts & Notifications

Notifications for:

Budget limit exceeded
Unusual spending detected
Savings goal milestones
Investment reminders
Bill payment reminders
12. Report Generation

Generate:

Monthly Reports
Quarterly Reports
Annual Financial Reports

Export formats:

PDF
CSV
Excel
System Architecture
Frontend
React.js
Vite
Tailwind CSS
Chart.js / Recharts
Axios
Backend
FastAPI
Python
SQLModel
PostgreSQL
JWT Authentication
AI Components
Python
Scikit-Learn
Pandas
NumPy
OpenAI/LLM Integration
RAG Pipeline
Vector Database (ChromaDB/FAISS)
Database
PostgreSQL
Project Workflow
User registers and logs in.
User adds income and expenses.
Data is stored in PostgreSQL.
AI engine analyzes financial behavior.
Dashboard displays financial insights.
Financial Health Score is calculated.
AI chatbot provides recommendations.
Forecasting model predicts future expenses.
User receives alerts and suggestions.
Reports can be exported anytime.
Running the Project
Frontend Setup
# Install dependencies
npm install

# Start development server
npm run dev

Frontend will run on:

http://localhost:5173
Backend Setup
Create Virtual Environment
python -m venv venv
Activate Environment

Windows:

venv\Scripts\activate

Linux/Mac:

source venv/bin/activate
Install Dependencies
pip install -r requirements.txt
Run Backend Server
uvicorn app.main:app --reload

Backend will run on:

http://localhost:8000
API Documentation

Swagger UI:

http://localhost:8000/docs

ReDoc:

http://localhost:8000/redoc
