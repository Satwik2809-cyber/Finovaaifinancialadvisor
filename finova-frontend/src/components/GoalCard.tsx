import { useState } from 'react';
import { motion } from 'motion/react';
import { Goal } from '../types';
import { Progress } from './ui/progress';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { addSavingsToGoal } from '../lib/api';
import { toast } from 'sonner';

interface GoalCardProps {
  goal: Goal;
  onComplete?: () => void;
}

export function GoalCard({ goal, onComplete }: GoalCardProps) {
  const [addAmount, setAddAmount] = useState('');
  const [currentSaved, setCurrentSaved] = useState(goal.currentAmount);

  const progress = (currentSaved / goal.amount) * 100;
  const isCompleted = progress >= 100;

  const handleAddSavings = async () => {
    if (!addAmount || isNaN(Number(addAmount))) return;
    try {
      const res = await addSavingsToGoal(goal.id, Number(addAmount));
      setCurrentSaved(res.new_saved);
      toast.success(`Added ₹${addAmount} to ${goal.name}!`);
      setAddAmount('');
      if (res.new_saved >= goal.amount && onComplete) {
         onComplete();
      }
    } catch(err) {
      toast.error('Failed to add savings');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${goal.color} rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden border-2 border-white/20`}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: 0 
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 0.6 }
          }}
          className="absolute top-4 right-4 text-4xl"
        >
          🎉
        </motion.div>
      )}
      
      <div className="relative z-10">
        <motion.h3 
          className="text-white mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {goal.name}
        </motion.h3>
        <p className="text-white/90 text-sm mb-4">{goal.purpose}</p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <motion.span 
              className="text-3xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              ₹{currentSaved.toLocaleString()}
            </motion.span>
            <span className="text-sm text-white/90">of ₹{goal.amount.toLocaleString()}</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-white/30 shadow-inner" />
            {progress > 0 && (
              <motion.div
                className="absolute top-0 left-0 h-3 bg-white/20 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-white">
            <Calendar className="w-4 h-4" />
            <span>{new Date(goal.deadline).toLocaleDateString()}</span>
          </div>
          <motion.span 
            className="text-lg font-bold"
            animate={{ 
              scale: isCompleted ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 1, repeat: isCompleted ? Infinity : 0 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>

        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm bg-white/30 rounded-xl p-3 backdrop-blur-sm font-semibold"
          >
            🎊 Goal Achieved! Your dreams are now funded 💪
          </motion.div>
        ) : (
          <div className="mt-4 flex flex-col gap-2 relative z-10 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
             <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Add Savings</span>
             <div className="flex gap-2">
                 <Input 
                   value={addAmount} 
                   onChange={e => setAddAmount(e.target.value)} 
                   type="number" 
                   placeholder="₹ Amount" 
                   className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-9 flex-1" 
                 />
                 <Button onClick={handleAddSavings} size="sm" variant="secondary" className="bg-white text-black hover:bg-white/90 font-bold h-9">
                     Save
                 </Button>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
