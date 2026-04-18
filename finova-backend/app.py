from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import pandas as pd
import io
import datetime
import json
import pickle
import os
from typing import Optional, List
import yfinance as yf
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- 1. FastAPI App Initialization ---
app = FastAPI(title="FINOVA Backend")

# --- 2. CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Pydantic Models for Validation ---
class UserProfile(BaseModel):
    name: str
    email: str
    income: float
    currency: str = "INR"
    chatbot_tone: str = "Coach"

class IncomeUpdate(BaseModel):
    income: float

class TransactionCreate(BaseModel):
    date: str
    merchant: str
    amount: float
    category: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = "manual"

class CategoryUpdate(BaseModel):
    category: str

class ClassifyRequest(BaseModel):
    merchant: str
    description: str = ""

class GoalCreate(BaseModel):
    title: str
    target: float
    saved: Optional[float] = 0
    deadline: Optional[str] = None
    vault_type: Optional[str] = "general"

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target: Optional[float] = None
    saved: Optional[float] = None
    deadline: Optional[str] = None
    vault_type: Optional[str] = None

class SavingsAdd(BaseModel):
    amount: float

class XPIncrement(BaseModel):
    amount: int

class StreakUpdate(BaseModel):
    increment: Optional[int] = 1
    reset: Optional[bool] = False

class BadgeUnlock(BaseModel):
    badge_name: str

class SIPRequest(BaseModel):
    monthly_amount: float
    years: int
    expected_annual_return: float

class RiskProfileRequest(BaseModel):
    age: int
    monthly_income: float
    risk_tolerance: str # low, medium, high
    goal_horizon_years: int

class WatchlistItem(BaseModel):
    symbol: str
    label: Optional[str] = None
    asset_type: Optional[str] = "stock"

class ChatRequest(BaseModel):
    message: str
    tone: Optional[str] = "coach"


# --- 7. SQLite Database Helper ---
DB_NAME = "database.db"

def get_db_connection():
    """Helper function to create a connection to the SQLite database."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# --- 8. Database Initialization ---
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            income REAL DEFAULT 0,
            currency TEXT DEFAULT 'INR',
            chatbot_tone TEXT DEFAULT 'Coach'
        )
    """)

    # Transactions Table
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

    # Goals Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            target REAL NOT NULL,
            saved REAL DEFAULT 0,
            deadline TEXT,
            vault_type TEXT DEFAULT 'general'
        )
    """)

    # Rewards Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rewards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            xp INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            badges TEXT DEFAULT ''
        )
    """)

    # Watchlist Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT UNIQUE NOT NULL,
            label TEXT,
            asset_type TEXT DEFAULT 'stock'
        )
    """)

    # Ensure a single rewards row exists for the MVP
    cursor.execute("SELECT id FROM rewards LIMIT 1")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO rewards (xp, streak, badges) VALUES (0, 0, '[]')")

    conn.commit()
    conn.close()

init_db()

# --- 14. ML Model Integration ---

# Paths to ML artifacts
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "model.pkl")
VEC_PATH = os.path.join(os.path.dirname(__file__), "ml", "vectorizer.pkl")

# Global variables for the model
ml_model = None
ml_vectorizer = None

def load_ml_artifacts():
    """Loads the trained ML model and vectorizer from the ml/ directory."""
    global ml_model, ml_vectorizer
    if os.path.exists(MODEL_PATH) and os.path.exists(VEC_PATH):
        try:
            with open(MODEL_PATH, 'rb') as f:
                ml_model = pickle.load(f)
            with open(VEC_PATH, 'rb') as f:
                ml_vectorizer = pickle.load(f)
            print("INFO: ML Model and Vectorizer loaded successfully!")
        except Exception as e:
            print(f"WARNING: Failed to load ML artifacts: {e}")
    else:
        print("INFO: ML model files not found. Auto-classification will be disabled.")

# Load models on startup
load_ml_artifacts()

def predict_category(merchant: str, description: str = ""):
    """Uses the loaded model to predict the category of a transaction."""
    if ml_model is None or ml_vectorizer is None:
        return None
    
    input_text = f"{merchant} {description}"
    features = ml_vectorizer.transform([input_text])
    prediction = ml_model.predict(features)
    return prediction[0]

# --- INTERNAL REWARD HELPERS ---

def add_xp_internal(amount: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE rewards SET xp = xp + ? WHERE id = 1", (amount,))
    conn.commit()
    conn.close()

def unlock_badge_internal(badge_name: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT badges FROM rewards WHERE id = 1")
    row = cursor.fetchone()
    current_badges = []
    if row and row['badges']:
        try: current_badges = json.loads(row['badges'])
        except: current_badges = []
    if badge_name not in current_badges:
        current_badges.append(badge_name)
        cursor.execute("UPDATE rewards SET badges = ? WHERE id = 1", (json.dumps(current_badges),))
        conn.commit()
        conn.close()
        return True
    conn.close()
    return False

# --- 4. Profile API Routes ---

@app.post("/profile/setup", tags=["Profile"])
def setup_profile(profile: UserProfile):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users LIMIT 1")
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.execute("""
            UPDATE users SET name = ?, email = ?, income = ?, currency = ?, chatbot_tone = ?
            WHERE id = ?
        """, (profile.name, profile.email, profile.income, profile.currency, profile.chatbot_tone, existing_user['id']))
    else:
        cursor.execute("""
            INSERT INTO users (name, email, income, currency, chatbot_tone)
            VALUES (?, ?, ?, ?, ?)
        """, (profile.name, profile.email, profile.income, profile.currency, profile.chatbot_tone))
    conn.commit()
    conn.close()
    return {"message": "Profile updated successfully!"}

@app.get("/profile", tags=["Profile"])
def get_profile():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users LIMIT 1")
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else {"error": "Profile not found."}

# --- 9. Transaction API Routes ---

@app.post("/transactions/add", tags=["Transactions"])
def add_transaction(tx: TransactionCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM transactions")
    is_first = cursor.fetchone()[0] == 0
    cursor.execute("""
        INSERT INTO transactions (date, merchant, amount, category, description, source)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (tx.date, tx.merchant, tx.amount, tx.category, tx.description, tx.source))
    conn.commit()
    conn.close()
    add_xp_internal(10)
    if is_first: unlock_badge_internal("First Expense Logged")
    return {"message": "Transaction added!", "xp_earned": 10}

@app.get("/transactions", tags=["Transactions"])
def get_transactions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY date DESC, id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/transactions/upload", tags=["Transactions"])
async def upload_csv(file: UploadFile = File(...)):
    """Upload a CSV of transactions. Expected columns: date, merchant, amount"""
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Ensure correct column names exist
        expected_cols = {'date', 'merchant', 'amount'}
        if not expected_cols.issubset(set(df.columns.str.lower())):
             raise HTTPException(status_code=400, detail="CSV must contain 'date', 'merchant', and 'amount' columns.")
        
        # Standardize column names
        df.columns = df.columns.str.lower()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM transactions")
        is_first = cursor.fetchone()[0] == 0
        
        added_count = 0
        for _, row in df.iterrows():
            try:
                date_str = str(row['date'])
                merchant = str(row['merchant'])
                amount = float(row['amount'])
                category = str(row.get('category', '')) if pd.notna(row.get('category')) else None
                desc = str(row.get('description', '')) if pd.notna(row.get('description')) else None
                
                cursor.execute("""
                    INSERT INTO transactions (date, merchant, amount, category, description, source)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (date_str, merchant, amount, category, desc, 'csv_import'))
                added_count += 1
            except Exception as e:
                print(f"Skipping invalid row: {e}")
                continue
                
        conn.commit()
        conn.close()
        
        add_xp_internal(20)
        if is_first: unlock_badge_internal("First Expense Logged")
        
        # Optionally auto-classify right after uploading if ML model feels good
        if ml_model is not None:
             auto_classify_all()
             
        return {"message": f"Successfully imported {added_count} transactions!", "xp_earned": 20}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

# --- 15. ML Classification Routes ---

@app.post("/classify", tags=["ML Intelligence"])
def classify_text(req: ClassifyRequest):
    """Classifies a single transaction input into a category."""
    prediction = predict_category(req.merchant, req.description)
    if prediction:
        return {"predicted_category": prediction}
    return {"error": "ML Model not initialized or files missing."}

@app.post("/transactions/auto-classify", tags=["ML Intelligence"])
def auto_classify_all():
    """Automatically categorizes all transactions in the database that have no category."""
    if ml_model is None:
        raise HTTPException(status_code=400, detail="ML Model not trained or missing from disk.")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Fetch transactions with missing categories (NULL or empty string)
    cursor.execute("""
        SELECT id, merchant, description FROM transactions 
        WHERE category IS NULL OR category = '' OR category = 'Uncategorized'
    """)
    rows = cursor.fetchall()
    
    updated_count = 0
    for row in rows:
        predicted = predict_category(row['merchant'], row['description'] or "")
        if predicted:
            cursor.execute("UPDATE transactions SET category = ? WHERE id = ?", (predicted, row['id']))
            updated_count += 1
            
    conn.commit()
    conn.close()
    
    return {
        "message": "Auto-classification complete!",
        "updated_count": updated_count
    }

# --- 10. Goals & Vault API Routes ---

@app.post("/goals/add", tags=["Goals"])
def add_goal(goal: GoalCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM goals")
    is_first = cursor.fetchone()[0] == 0
    cursor.execute("INSERT INTO goals (title, target, saved, deadline, vault_type) VALUES (?, ?, ?, ?, ?)",
                   (goal.title, goal.target, goal.saved, goal.deadline, goal.vault_type))
    conn.commit()
    conn.close()
    add_xp_internal(50)
    if is_first: unlock_badge_internal("Goal Starter")
    return {"message": "Goal created!", "xp_earned": 50}

@app.get("/goals", tags=["Goals"])
def get_goals():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM goals")
    rows = cursor.fetchall()
    conn.close()
    results = []
    today = datetime.date.today()
    for row in rows:
        goal = dict(row)
        prog = (goal['saved']/goal['target']*100) if goal['target'] > 0 else 0
        goal['progress_percent'] = round(min(prog, 100), 2)
        goal['remaining_amount'] = max(0, goal['target'] - goal['saved'])
        goal['status'] = "completed" if goal['saved'] >= goal['target'] else "active"
        if goal['deadline']:
            try:
                d = datetime.datetime.strptime(goal['deadline'], "%Y-%m-%d").date()
                goal['days_left'] = max(0, (d - today).days)
            except: goal['days_left'] = None
        else: goal['days_left'] = None
        results.append(goal)
    return results

@app.post("/goals/{goal_id}/save", tags=["Goals"])
def add_goal_savings(goal_id: int, req: SavingsAdd):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM goals WHERE id = ?", (goal_id,))
    goal = cursor.fetchone()
    if not goal:
        conn.close()
        raise HTTPException(status_code=404, detail="Goal not found")
        
    new_saved = goal['saved'] + req.amount
    cursor.execute("UPDATE goals SET saved = ? WHERE id = ?", (new_saved, goal_id))
    conn.commit()
    conn.close()
    
    add_xp_internal(25)
    return {"message": "Savings added!", "new_saved": new_saved, "xp_earned": 25}

# --- 12. Smart AI Nudges API ---

@app.get("/nudges", tags=["AI Insights"])
def get_nudges():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT income FROM users LIMIT 1")
    user = cursor.fetchone()
    user_income = user['income'] if user else 0
    cursor.execute("SELECT amount, category FROM transactions")
    transactions = cursor.fetchall()
    cursor.execute("SELECT title, target, saved FROM goals")
    goals = cursor.fetchall()
    conn.close()
    nudges = []
    if not transactions:
        nudges.append({"type":"starter","title":"Fresh Start","message":"Log an expense!","priority":"high"})
        return {"nudges": nudges}
    total_spend = sum(t['amount'] for t in transactions)
    if user_income > 0 and (total_spend / user_income) > 0.7:
        nudges.append({"type":"warning","title":"High Spend","message":"You've spent >70% income","priority":"high"})
    return {"nudges": nudges}

# --- 13. Educational Investment APIs ---

@app.post("/invest/sip-simulator", tags=["Education & Invest"])
def sip_simulator(req: SIPRequest):
    monthly_rate = req.expected_annual_return / 12 / 100
    months = req.years * 12
    if monthly_rate > 0:
        final_value = req.monthly_amount * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        final_value = req.monthly_amount * months
    invested_amount = req.monthly_amount * months
    estimated_returns = final_value - invested_amount
    return {
        "invested_amount": round(invested_amount, 2),
        "estimated_returns": round(estimated_returns, 2),
        "final_value": round(final_value, 2)
    }

@app.get("/invest/education", tags=["Education & Invest"])
def get_investment_education():
    return {
        "cards": [
            {"title": "What is an SIP?", "content": "Systematic Investment Plan..."},
            {"title": "Compounding", "content": "Interest on interest..."}
        ]
    }
@app.get("/health-score", tags=["AI Insights"])
def get_health_score():
    """Calculates and returns the user's overall financial health score (0-100)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Simple logic for MVP health score
    cursor.execute("SELECT income FROM users LIMIT 1")
    user = cursor.fetchone()
    income = user['income'] if user else 0
    
    cursor.execute("SELECT SUM(amount) as total FROM transactions")
    tx = cursor.fetchone()
    total_spend = tx['total'] if tx['total'] else 0
    
    cursor.execute("SELECT streak FROM rewards WHERE id = 1")
    rewards = cursor.fetchone()
    streak = rewards['streak'] if rewards else 0
    
    conn.close()
    
    # Base score
    score = 70
    
    # Income vs Spend modification
    if income > 0:
        ratio = total_spend / income
        if ratio < 0.4: score += 15
        elif ratio < 0.6: score += 5
        elif ratio > 0.8: score -= 15
        
    # Consistency bonus
    if streak > 7: score += 10
    elif streak > 3: score += 5
    
    # Cap at 100 and min at 0
    final_score = max(0, min(100, score))
    
    return {
        "score": final_score,
        "rating": "Excellent" if final_score > 85 else "Good" if final_score > 70 else "Fair" if final_score > 40 else "Needs Attention"
    }

# --- 11. Rewards System API Routes ---
@app.get("/rewards", tags=["Rewards"])
def get_rewards():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT xp, streak, badges FROM rewards WHERE id = 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        data = dict(row)
        try: data['badges'] = json.loads(data['badges'])
        except: data['badges'] = []
        return data
    return {"xp": 0, "streak": 0, "badges": []}

@app.post("/rewards/increment-xp", tags=["Rewards"])
def increment_xp(data: XPIncrement):
    add_xp_internal(data.amount)
    return {"message": "XP Added!"}

# --- 16. Educational Market Tracking ---

@app.get("/market/quote/{symbol}", tags=["Market Intelligence"])
def get_market_quote(symbol: str):
    """Educational market tracking: Returns current price and key stats."""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d")
        if hist.empty:
            raise HTTPException(status_code=404, detail="Symbol not found or no data")

        current_price = float(hist['Close'].iloc[-1])
        day_high = float(hist['High'].iloc[-1])
        day_low = float(hist['Low'].iloc[-1])
        open_price = float(hist['Open'].iloc[-1])
        volume = int(hist['Volume'].iloc[-1])

        try:
            previous_close = float(ticker.fast_info.get("previousClose", current_price))
        except:
            previous_close = current_price

        if previous_close > 0:
            percent_change = ((current_price - previous_close) / previous_close) * 100
        else:
            percent_change = 0.0

        return {
            "symbol": symbol.upper(),
            "current_price": round(current_price, 2),
            "day_high": round(day_high, 2),
            "day_low": round(day_low, 2),
            "previous_close": round(previous_close, 2),
            "open": round(open_price, 2),
            "volume": volume,
            "percent_change": round(percent_change, 2)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching market quote: {str(e)}")

@app.get("/market/trend/{symbol}", tags=["Market Intelligence"])
def get_market_trend(symbol: str, range: str = "1mo"):
    """
    Educational market tracking: Returns time series data.
    Supported ranges: 7d, 1mo, 3mo, 6mo, 1y
    """
    valid_ranges = {"7d": "7d", "1mo": "1mo", "3mo": "3mo", "6mo": "6mo", "1y": "1y"}
    if range not in valid_ranges:
        raise HTTPException(status_code=400, detail="Invalid range. Use 7d, 1mo, 3mo, 6mo, or 1y")

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=valid_ranges[range])
        if hist.empty:
            raise HTTPException(status_code=404, detail="No trend data found for this symbol")

        # Prepare time series data suitable for frontend charts
        trend_data = []
        for index, row in hist.iterrows():
            trend_data.append({
                "date": index.strftime("%Y-%m-%d"),
                "close": round(float(row['Close']), 2)
            })

        return {
            "symbol": symbol.upper(),
            "range": range,
            "data": trend_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching trend data: {str(e)}")

@app.get("/market/summary", tags=["Market Intelligence"])
def get_market_summary():
    """
    Educational market tracking: Returns simple educational market summary.
    Includes indices like NIFTY 50, S&P 500, Gold.
    """
    indices = {
        "^NSEI": "NIFTY 50",
        "^GSPC": "S&P 500",
        "GC=F": "Gold",
        "BTC-USD": "Bitcoin"
    }

    summary_data = []
    try:
        for symbol, name in indices.items():
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="5d")
            if not hist.empty and len(hist) >= 2:
                current_price = float(hist['Close'].iloc[-1])
                prev_close = float(hist['Close'].iloc[-2])
                change = current_price - prev_close
                percent_change = (change / prev_close) * 100

                summary_data.append({
                    "name": name,
                    "symbol": symbol,
                    "current_price": round(current_price, 2),
                    "percent_change": round(percent_change, 2),
                    "trend": "up" if change >= 0 else "down"
                })
        return {
            "disclaimer": "This is an educational market intelligence module, not direct trading advice.",
            "summary": summary_data
        }
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Error fetching market summary: {str(e)}")

# --- 17. Watchlist API Routes ---

@app.post("/market/watchlist/add", tags=["Watchlist"])
def add_to_watchlist(item: WatchlistItem):
    """Adds a new symbol to the educational watchlist."""
    symbol_upper = item.symbol.upper()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO watchlist (symbol, label, asset_type) VALUES (?, ?, ?)",
            (symbol_upper, item.label, item.asset_type)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Symbol already in watchlist.")
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail=str(e))
    
    conn.close()
    return {"message": f"{symbol_upper} added to watchlist."}

@app.get("/market/watchlist", tags=["Watchlist"])
def get_watchlist():
    """Retrieves all saved watchlist items and their latest market stats."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM watchlist ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    watchlist = []
    for row in rows:
        item = dict(row)
        # Attempt to get latest quote using yfinance
        try:
            ticker = yf.Ticker(item['symbol'])
            hist = ticker.history(period="1d")
            
            if not hist.empty:
                current_price = float(hist['Close'].iloc[-1])
                
                try:
                    previous_close = float(ticker.fast_info.get("previousClose", current_price))
                except:
                    previous_close = current_price
                    
                if previous_close > 0:
                    percent_change = ((current_price - previous_close) / previous_close) * 100
                else:
                    percent_change = 0.0
                    
                item['current_price'] = round(current_price, 2)
                item['percent_change'] = round(percent_change, 2)
            else:
                item['current_price'] = None
                item['percent_change'] = None
        except Exception:
            item['current_price'] = None
            item['percent_change'] = None
            
        watchlist.append(item)
        
    return watchlist

@app.delete("/market/watchlist/{symbol}", tags=["Watchlist"])
def remove_from_watchlist(symbol: str):
    """Removes a symbol from the watchlist."""
    symbol_upper = symbol.upper()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM watchlist WHERE symbol = ?", (symbol_upper,))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Symbol not found in watchlist.")
        
    conn.commit()
    conn.close()
    return {"message": f"{symbol_upper} removed from watchlist."}

# --- 18. AI Chatbot Routes ---
# Initialize APIs via Environment Variables
gemini_api_key = os.getenv("GEMINI_API_KEY")
hf_token = os.getenv("HUGGINGFACE_TOKEN") # **ADD YOUR HUGGINGFACE TOKEN HERE OR IN .ENV**
openai_api_key = os.getenv("OPENAI_API_KEY")

try:
    import google.generativeai as genai
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    else:
        gemini_model = None
except:
    gemini_model = None

try:
    from huggingface_hub import InferenceClient
    if hf_token:
        hf_client = InferenceClient("HuggingFaceH4/zephyr-7b-beta", token=hf_token)
    else:
        hf_client = InferenceClient("HuggingFaceH4/zephyr-7b-beta") # Rate-limited/might fail without token
except:
    hf_client = None

@app.post("/chat/ask", tags=["AI Insights"])
def ask_chat(req: ChatRequest):
    # Context gathering
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT income FROM users LIMIT 1")
    user = c.fetchone()
    income = user['income'] if user else 0
    c.execute("SELECT name FROM users LIMIT 1")
    user_name_row = c.fetchone()
    user_name = user_name_row['name'] if user_name_row else "User"
    c.execute("SELECT SUM(amount) as total FROM transactions")
    tx = c.fetchone()
    spent = tx['total'] if tx and tx['total'] else 0
    conn.close()

    sys_prompt = f"You are Finova, an AI financial {req.tone} for {user_name}. Income: {income}, Spent: {spent}. Be brief, helpful, and use emojis."
    
    # 1. Try Gemini first (Best Results if API key configured)
    if gemini_model:
        try:
            full_prompt = f"{sys_prompt}\n\nUser Question: {req.message}"
            response = gemini_model.generate_content(full_prompt)
            return {"response": response.text.replace("*", "").strip()}
        except Exception as e:
            print(f"Gemini Error: {e}")

    # 2. Try Hugging Face fallback
    if hf_client:
        try:
             messages = [
                 {"role": "system", "content": sys_prompt},
                 {"role": "user", "content": req.message}
             ]
             response = hf_client.chat_completion(messages, max_tokens=150)
             return {"response": response.choices[0].message.content.strip()}
        except Exception as e:
             print(f"HF Error: {e}")
             
    # 3. Local/Offline Fallback if all else fails
    msg = req.message.lower()
    fallback_response = f"That's a great question, {user_name}! As your {req.tone}, I'd say: Focus on building good financial habits. Track your expenses, save regularly, and invest wisely."
    
    if 'sip' in msg:
        fallback_response = "SIP (Systematic Investment Plan) is a way to invest a fixed amount regularly in mutual funds. It helps build wealth through rupee cost averaging and compounding. Start with as little as ₹500/month!"
    elif 'budget' in msg or '50/30/20' in msg:
        fallback_response = "Here's a smart breakdown using the 50/30/20 rule:\n• 50% - Needs (food, transport)\n• 30% - Wants (entertainment, dining out)\n• 20% - Savings/Investments"
    elif 'score' in msg:
        fallback_response = "Your health score is based on your Income-to-Spend ratio and your habits streak. Save more to increase it!"
    elif 'market' in msg or 'stock' in msg:
        fallback_response = "The stock market can be volatile! Check the Insights tab for live educational market data and make sure you have a diversified portfolio."
    elif 'expense' in msg or 'track' in msg:
        fallback_response = "Tracking expenses is the first step to financial freedom. Make sure you upload your latest CSV or type in your expenses manually!"
    elif 'save' in msg or 'saving' in msg:
        fallback_response = "Consistency is key! Try to save at least 20% of your income. Setup automatic transfers to a separate account if possible."
    elif 'debt' in msg or 'loan' in msg:
        fallback_response = "Focus on paying off high-interest debts first (like credit cards). For loans, consider the avalanche or snowball method."
    elif 'goal' in msg or 'target' in msg:
        fallback_response = "Goals keep you motivated. Make sure your financial goals are SMART: Specific, Measurable, Achievable, Relevant, and Time-bound."
    elif 'hello' in msg or 'hi' in msg:
        fallback_response = "Hello! I am Finova, your personal AI finance assistant. Ask me anything about budgeting, saving, investing, or market tracking!"
        
    return {"response": f"{fallback_response}\n\n*(Note: AI API is offline. Proceeding with fallback mode. Let me know if you would like me to assist you with something else!)*"}

# --- 19. Analytics Routes ---

@app.get("/insights/spending", tags=["Analytics"])
def get_spending_insights():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT amount, category FROM transactions")
    txs = cursor.fetchall()
    conn.close()
    
    cats = {}
    total = 0
    for tx in txs:
        # Some transactions might not have category defined yet
        c = tx['category'] if tx['category'] else 'Uncategorized'
        a = tx['amount']
        cats[c] = cats.get(c, 0) + a
        total += a
        
    emoji_map = {'Food':'🍔', 'Shopping':'🛍️', 'Bills':'🏠', 'Travel':'🚕', 'Entertainment':'🎬', 'Uncategorized':'❓'}
    color_map = {'Food':'#FFBE98', 'Shopping':'#4BE1C3', 'Bills':'#A78BFA', 'Travel':'#60A5FA', 'Entertainment':'#F472B6', 'Uncategorized':'#9CA3AF'}
    
    result = []
    for c, a in cats.items():
        result.append({
            "name": c,
            "amount": a,
            "percentage": round((a/max(total,1))*100),
            "emoji": emoji_map.get(c, '💸'),
            "color": color_map.get(c, '#CBD5E1')
        })
    return sorted(result, key=lambda x: x['amount'], reverse=True)


@app.get("/insights/cashflow", tags=["Analytics"])
def get_cashflow():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT amount FROM transactions WHERE date >= date('now', '-30 days')")
    txs = c.fetchall()
    conn.close()
    
    total_spent_30d = sum(t['amount'] for t in txs)
    daily_burn_rate = total_spent_30d / 30 if total_spent_30d > 0 else 500
    
    base_balance = 50000
    
    return [
        {"day": "Today", "balance": int(base_balance)},
        {"day": "7d", "balance": int(base_balance - daily_burn_rate * 7)},
        {"day": "14d", "balance": int(base_balance - daily_burn_rate * 14)},
        {"day": "21d", "balance": int(base_balance - daily_burn_rate * 21)},
        {"day": "30d", "balance": int(base_balance - daily_burn_rate * 30)}
    ]

@app.get("/insights/behavior", tags=["Analytics"])
def get_behavior():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT category, SUM(amount) as s FROM transactions GROUP BY category ORDER BY s DESC LIMIT 1")
    top_cat = c.fetchone()
    conn.close()
    
    if top_cat and top_cat['category']:
        cat = top_cat['category']
        return {"message": f"📊 Behavioral Analytics\nYou spend the most on {cat}! Consider setting a strict budget to improve your savings."}
    return {"message": "📊 Behavioral Analytics\nLog more transactions to see your habits!"}


# --- 5. General Routes ---
@app.get("/", tags=["System"])
def read_root(): return {"message": "FINOVA Backend is running successfully! 🚀"}

@app.get("/status", tags=["System"])
def get_status(): return {"status": "online"}

@app.get("/version", tags=["System"])
def get_version(): return {"version": "1.7.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
