import csv
import random
from datetime import datetime, timedelta

def generate_csv():
    csv_file = 'jury_demo_transactions.csv'
    # Use lowercase headers to ensure consistency with backend expected columns
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['date', 'merchant', 'amount', 'category', 'description'])
        
        demo_txs = [
            ("Starbucks", 350.0, "Food", "Morning Coffee"),
            ("Uber", 450.0, "Travel", "Office Ride"),
            ("Zomato", 800.0, "Food", "Lunch"),
            ("Amazon", 2500.0, "Shopping", "Headphones"),
            ("Electricity Board", 1200.0, "Bills", "Monthly Electricity"),
            ("Netflix", 499.0, "Entertainment", "Subscription"),
            ("Myntra", 3200.0, "Shopping", "Clothes"),
            ("IRCTC", 1800.0, "Travel", "Train Ticket"),
            ("Local Grocery", 950.0, "Food", "Groceries"),
            ("Spotify", 119.0, "Entertainment", "Music Subscription"),
        ]
        
        today = datetime.now()
        for merchant, amount, cat, desc in demo_txs:
            random_days = random.randint(0, 15)
            date = (today - timedelta(days=random_days)).strftime("%Y-%m-%d")
            writer.writerow([date, merchant, amount, cat, desc])
            
    print(f"Successfully created {csv_file}")

if __name__ == "__main__":
    generate_csv()
