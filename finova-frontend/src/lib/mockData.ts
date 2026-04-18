import { Transaction, Goal, Badge, SpendingCategory, Nudge } from '../types';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2025-10-25', merchant: 'Swiggy', amount: 450, category: 'Food' },
  { id: '2', date: '2025-10-24', merchant: 'Uber', amount: 230, category: 'Travel' },
  { id: '3', date: '2025-10-23', merchant: 'Amazon', amount: 1200, category: 'Shopping' },
  { id: '4', date: '2025-10-22', merchant: 'Starbucks', amount: 380, category: 'Food' },
  { id: '5', date: '2025-10-21', merchant: 'Zara', amount: 2500, category: 'Shopping' },
  { id: '6', date: '2025-10-20', merchant: 'Ola', amount: 150, category: 'Travel' },
  { id: '7', date: '2025-10-19', merchant: 'Electricity Bill', amount: 1800, category: 'Bills' },
  { id: '8', date: '2025-10-18', merchant: 'McDonald\'s', amount: 320, category: 'Food' },
  { id: '9', date: '2025-10-17', merchant: 'BookMyShow', amount: 600, category: 'Entertainment' },
  { id: '10', date: '2025-10-16', merchant: 'Dominos', amount: 890, category: 'Food' },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Goa Trip',
    amount: 50000,
    currentAmount: 20000,
    deadline: '2025-12-31',
    purpose: 'Beach vacation with friends',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: '2',
    name: 'New Laptop',
    amount: 80000,
    currentAmount: 12000,
    deadline: '2026-03-15',
    purpose: 'MacBook Pro for work',
    color: 'from-purple-400 to-pink-400'
  },
  {
    id: '3',
    name: 'Emergency Fund',
    amount: 100000,
    currentAmount: 45000,
    deadline: '2026-06-30',
    purpose: '6 months expenses',
    color: 'from-green-400 to-emerald-400'
  },
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Upload',
    description: 'Uploaded your first transaction',
    icon: '📤',
    unlocked: true,
    unlockedDate: '2025-10-01'
  },
  {
    id: '2',
    name: 'Smart Saver',
    description: 'Saved for 7 consecutive days',
    icon: '💰',
    unlocked: true,
    unlockedDate: '2025-10-15'
  },
  {
    id: '3',
    name: 'Debt Dodger',
    description: 'Zero credit card debt for 30 days',
    icon: '🛡️',
    unlocked: true,
    unlockedDate: '2025-10-20'
  },
  {
    id: '4',
    name: 'Compound Captain',
    description: 'Completed 10 investment lessons',
    icon: '📈',
    unlocked: false
  },
  {
    id: '5',
    name: 'Budget Boss',
    description: 'Stayed within budget for 3 months',
    icon: '👑',
    unlocked: false
  },
  {
    id: '6',
    name: 'Goal Getter',
    description: 'Completed your first savings goal',
    icon: '🎯',
    unlocked: false
  },
];

export const mockSpendingCategories: SpendingCategory[] = [
  { name: 'Food', amount: 2040, percentage: 27, emoji: '🍔', color: '#FFBE98' },
  { name: 'Shopping', amount: 3700, percentage: 25, emoji: '🛍️', color: '#4BE1C3' },
  { name: 'Bills', amount: 1800, percentage: 20, emoji: '🏠', color: '#A78BFA' },
  { name: 'Travel', amount: 380, percentage: 18, emoji: '🚕', color: '#60A5FA' },
  { name: 'Entertainment', amount: 600, percentage: 10, emoji: '🎬', color: '#F472B6' },
];

export const mockNudges: Nudge[] = [
  {
    id: '1',
    message: "🍕 You're overspending on Food (27% vs 20%). Try a home-cook challenge!",
    type: 'warning',
    emoji: '🍕'
  },
  {
    id: '2',
    message: "💸 You've spent 70% of your budget by the 10th.",
    type: 'warning',
    emoji: '💸'
  },
  {
    id: '3',
    message: "🎉 Great job! You saved ₹5,000 this week.",
    type: 'success',
    emoji: '🎉'
  },
];

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
