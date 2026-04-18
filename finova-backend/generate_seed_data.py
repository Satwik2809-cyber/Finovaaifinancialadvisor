import sqlite3
import random
from datetime import datetime, timedelta
import csv

DB_PATH = 'database.db'

categories = ['Food', 'Shopping', 'Bills', 'Travel', 'Entertainment']
merchants = {
    'Food': ['Dominos', 'KFC', 'Zomato', 'Swiggy', 'Starbucks', 'Local Grocery'],
    'Shopping': ['Amazon', 'Flipkart', 'Zara', 'H&M', 'Myntra'],
    'Bills': ['Electricity Board', 'WiFi Provider', 'Water Tax', 'Phone Reload'],
    'Travel': ['Uber', 'Ola', 'Metro Card', 'IRCTC'],
    'Entertainment': ['Netflix', 'Spotify', 'PVR Cinemas', 'Steam']
}

def generate_random_date(days_back_max=30):
    today = datetime.now()
    random_days = random.randint(0, days_back_max)
    return (today - timedelta(days=random_days)).strftime("%Y-%m-%d")

def seed_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Initialize some user data for proper analytics
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (name, email, income) VALUES ('Tester', 'test@example.com', 80000)")
    
    # Clear existing transactions for fresh start by dropping and recreating table
    cursor.execute("DROP TABLE IF EXISTS transactions")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            merchant TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT,
            description TEXT,
            source TEXT DEFAULT 'manual'
        )
    """)
    
    # Create 20 random transactions
    for _ in range(25):
        cat = random.choice(categories)
        merchant = random.choice(merchants[cat])
        amount = round(random.uniform(100.0, 3000.0), 2)
        date = generate_random_date()
        desc = f"Payment to {merchant}"
        
        cursor.execute("""
            INSERT INTO transactions (date, merchant, amount, category, description, source)
            VALUES (?, ?, ?, ?, ?, 'seed')
        """, (date, merchant, amount, cat, desc))
        
    conn.commit()
    conn.close()
    print("Successfully seeded database.db with 25 transactions.")

def generate_csv():
    csv_file = '../dummy_transactions.csv'
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Date', 'Merchant', 'Amount', 'Category', 'Description'])
        for _ in range(15):
            cat = random.choice(categories)
            merchant = random.choice(merchants[cat])
            amount = round(random.uniform(50.0, 1500.0), 2)
            date = generate_random_date(10)
            writer.writerow([date, merchant, amount, cat, "CSV Upload test"])
    print(f"Successfully created {csv_file}")

if __name__ == "__main__":
    seed_database()
    generate_csv()
