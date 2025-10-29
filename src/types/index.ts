export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
}

export interface Goal {
  id: string;
  name: string;
  amount: number;
  currentAmount: number;
  deadline: string;
  purpose: string;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  emoji: string;
  color: string;
}

export interface Nudge {
  id: string;
  message: string;
  type: 'warning' | 'success' | 'info';
  emoji: string;
}

export type ChatTone = 'coach' | 'bestie' | 'professor';
