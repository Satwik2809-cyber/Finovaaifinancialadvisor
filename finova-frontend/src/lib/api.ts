const API_BASE = 'http://localhost:8000';

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function submitProfileSetup(data: any) {
  const res = await fetch(`${API_BASE}/profile/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(tx: any) {
  const res = await fetch(`${API_BASE}/transactions/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  });
  return res.json();
}

export async function fetchGoals() {
  const res = await fetch(`${API_BASE}/goals`);
  if (!res.ok) throw new Error('Failed to fetch goals');
  return res.json();
}

export async function addGoal(goal: any) {
  const res = await fetch(`${API_BASE}/goals/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  return res.json();
}

export async function addSavingsToGoal(goalId: string | number, amount: number) {
  const res = await fetch(`${API_BASE}/goals/${goalId}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error('Failed to add savings');
  return res.json();
}

export async function fetchNudges() {
  const res = await fetch(`${API_BASE}/nudges`);
  if (!res.ok) throw new Error('Failed to fetch nudges');
  return res.json(); // returns { nudges: [...] }
}

export async function fetchHealthScore() {
  const res = await fetch(`${API_BASE}/health-score`);
  if (!res.ok) throw new Error('Failed to fetch health score');
  return res.json(); // returns { score: number, rating: string }
}

export async function fetchRewards() {
  const res = await fetch(`${API_BASE}/rewards`);
  if (!res.ok) throw new Error('Failed to fetch rewards');
  return res.json(); // returns { xp: number, streak: number, badges: string[] }
}

export async function fetchInsightsSpending() {
  const res = await fetch(`${API_BASE}/insights/spending`);
  if (!res.ok) throw new Error('Failed to fetch spending insights');
  return res.json();
}

export async function uploadTransactionsCSV(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/transactions/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload CSV');
  return res.json();
}

export async function autoClassifyTransactions() {
  const res = await fetch(`${API_BASE}/transactions/auto-classify`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to auto classify');
  return res.json();
}

export async function fetchMarketSummary() {
  const res = await fetch(`${API_BASE}/market/summary`);
  if (!res.ok) throw new Error('Failed to fetch market summary');
  return res.json();
}

export async function askFinovaChatbot(message: string, tone: string = 'coach') {
  const res = await fetch(`${API_BASE}/chat/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, tone }),
  });
  if (!res.ok) throw new Error('Failed to fetch chatbot response');
  return res.json();
}

export async function fetchCashflow() {
  const res = await fetch(`${API_BASE}/insights/cashflow`);
  if (!res.ok) throw new Error('Failed to fetch cashflow');
  return res.json();
}

export async function fetchBehavior() {
  const res = await fetch(`${API_BASE}/insights/behavior`);
  if (!res.ok) throw new Error('Failed to fetch behavior');
  return res.json();
}

// Keep hardcoded educational topics as they are static in frontend anyway matching old mockData
export const learningTopics = [
  {
    id: '1',
    title: "What's an ETF?",
    emoji: '💹',
    content: 'Exchange-Traded Funds (ETFs) are baskets of stocks or bonds that trade on exchanges like individual stocks. They offer diversification at a lower cost.'
  },
  {
    id: '2',
    title: 'Index Funds vs Mutual Funds',
    emoji: '📊',
    content: 'Index funds passively track a market index, while mutual funds are actively managed. Index funds typically have lower fees.'
  },
  {
    id: '3',
    title: 'Compounding Magic Explained',
    emoji: '💰',
    content: 'Compound interest is when you earn interest on your interest. Starting early can turn small investments into significant wealth.'
  },
];

export const quickQuestions = [
  "What is SIP?",
  "How can I budget ₹10,000?",
  "Why did my health score drop?",
  "What's the 50/30/20 rule?",
];
