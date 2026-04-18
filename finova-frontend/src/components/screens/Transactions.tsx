import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { fetchTransactions, uploadTransactionsCSV, autoClassifyTransactions } from '../../lib/api';
import { Transaction } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, Sparkles, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const categories = ['All', 'Food', 'Shopping', 'Travel', 'Bills', 'Entertainment'];
const categoryColors: Record<string, string> = {
  Food: 'bg-[#FFBE98]/20 text-[#FFBE98]',
  Shopping: 'bg-[#4BE1C3]/20 text-[#4BE1C3]',
  Travel: 'bg-blue-500/20 text-blue-600',
  Bills: 'bg-purple-500/20 text-purple-600',
  Entertainment: 'bg-pink-500/20 text-pink-600',
};

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data.map((t: any) => ({ ...t, id: t.id.toString(), date: t.date })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await uploadTransactionsCSV(file);
      await loadData();
    } catch (err) {
      console.error("Failed to upload CSV:", err);
      alert("Failed to upload CSV. Please try again.");
    }
  };

  const handleAutoClassify = async () => {
    try {
      setLoading(true);
      await autoClassifyTransactions();
      await loadData();
    } catch (err) {
      console.error("Failed to auto classify", err);
      alert("Failed to run AI classification.");
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleCategoryChange = (id: string, newCategory: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category: newCategory } : t))
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Transactions Manager</h1>
        <p className="text-gray-600 mt-1">Track and categorize your spending</p>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
        <Button 
          className="gap-2 bg-[#4BE1C3] hover:bg-[#4BE1C3]/90"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <Upload className="w-4 h-4" />
          {loading ? 'Processing...' : 'Upload CSV 📤'}
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleAutoClassify}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4" />
          Auto-label with AI 🤖
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between px-4 py-2 bg-[#4BE1C3]/10 rounded-xl">
            <span className="text-sm">Total:</span>
            <span>₹{totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      value={transaction.category}
                      onValueChange={(value) => handleCategoryChange(transaction.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== 'All').map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Insights Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200"
      >
        <p className="text-sm">
          <span className="text-2xl mr-2">🛍️</span>
          <strong>Top category this week:</strong> Shopping ₹1,200
        </p>
      </motion.div>
    </div>
  );
}
