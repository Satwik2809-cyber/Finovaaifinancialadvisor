import { useState } from 'react';
import { motion } from 'motion/react';
import { mockGoals } from '../../lib/mockData';
import { Goal } from '../../types';
import { GoalCard } from '../GoalCard';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Calculator } from 'lucide-react';
import { toast } from 'sonner';

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showConfetti, setShowConfetti] = useState(false);
  const [roundUpSavings] = useState(12);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    amount: '',
    deadline: '',
    purpose: ''
  });

  const handleGoalComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.amount || !newGoal.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goalColors = [
      'from-blue-500 to-purple-600',
      'from-pink-500 to-rose-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
      'from-violet-500 to-purple-600',
    ];

    const newGoalData: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      amount: parseFloat(newGoal.amount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      purpose: newGoal.purpose || 'Saving for my goal',
      color: goalColors[Math.floor(Math.random() * goalColors.length)]
    };

    setGoals(prev => [...prev, newGoalData]);
    setNewGoal({ name: '', amount: '', deadline: '', purpose: '' });
    setIsDialogOpen(false);
    
    // Show success message
    toast.success(`🎯 Goal "${newGoal.name}" created successfully!`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <div className="text-9xl animate-bounce">🎉</div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Goals & Savings</h1>
        <p className="text-gray-600 mt-1">Create and visualize your saving targets</p>
      </motion.div>

      {/* Add New Goal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full bg-gradient-to-r from-[#4BE1C3] to-cyan-500 hover:from-[#4BE1C3]/90 hover:to-cyan-500/90 gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Add New Goal
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎯
              </motion.span>
              Create New Goal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Goal Name *</Label>
              <Input 
                id="name" 
                placeholder="e.g., New Phone" 
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="amount">Target Amount (₹) *</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="50000" 
                value={newGoal.amount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline *</Label>
              <Input 
                id="deadline" 
                type="date" 
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input 
                id="purpose" 
                placeholder="Why is this important?" 
                value={newGoal.purpose}
                onChange={(e) => setNewGoal(prev => ({ ...prev, purpose: e.target.value }))}
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="w-full bg-gradient-to-r from-[#4BE1C3] to-cyan-500 hover:from-[#4BE1C3]/90 hover:to-cyan-500/90 shadow-lg"
                onClick={handleCreateGoal}
              >
                Create Goal ✨
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Round-Up Savings Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#4BE1C3]/20 to-[#FFBE98]/20 rounded-3xl p-6 border-2 border-[#4BE1C3]/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4BE1C3] flex items-center justify-center text-2xl shrink-0">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Round-Up Savings</h3>
            <p className="text-sm text-gray-600 mb-3">
              Save ₹{roundUpSavings} on each transaction → Save ₹{roundUpSavings * 80}/month automatically!
            </p>
            <Button variant="outline" size="sm">
              Enable Round-Up
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onComplete={handleGoalComplete} />
        ))}
      </div>

      {/* AI Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h4>AI Tip</h4>
            <p className="text-sm text-gray-600 mt-1">
              Your Goa Trip goal could benefit from a short-term SIP investment. With 40% already saved, 
              consider investing in a liquid fund to earn ~6-7% returns while keeping funds accessible.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center"
      >
        <p className="text-xl mb-2">💪</p>
        <p className="text-lg">"Your dreams are funded when you plan ahead"</p>
        <p className="text-sm text-white/80 mt-2">Keep going, you're doing great!</p>
      </motion.div>
    </div>
  );
}
