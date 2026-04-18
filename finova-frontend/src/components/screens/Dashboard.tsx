import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HealthScoreCard } from '../HealthScoreCard';
import { SpendingChart } from '../SpendingChart';
import { CashflowChart } from '../CashflowChart';
import { NudgeCard } from '../NudgeCard';
import { GoalCard } from '../GoalCard';
import { fetchHealthScore, fetchRewards, fetchNudges, fetchGoals, fetchInsightsSpending, fetchProfile } from '../../lib/api';
import { Button } from '../ui/button';
import { Upload, Sparkles, Target } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Goal, Nudge, SpendingCategory, Badge as BadgeType } from '../../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [userName, setUserName] = useState('User');
  const [healthScore, setHealthScore] = useState(70);
  const [streak, setStreak] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<{id:string; name:string; icon:string}[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [spendingCategories, setSpendingCategories] = useState<SpendingCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, scoreRes, rewardsRes, nudgesRes, goalsRes, spendingRes] = await Promise.all([
          fetchProfile().catch(() => ({ name: 'User' })),
          fetchHealthScore().catch(() => ({ score: 70 })),
          fetchRewards().catch(() => ({ streak: 0, badges: [] })),
          fetchNudges().catch(() => ({ nudges: [] })),
          fetchGoals().catch(() => []),
          fetchInsightsSpending().catch(() => [])
        ]);

        if (profileRes.name) setUserName(profileRes.name);
        setHealthScore(scoreRes.score || 70);
        setStreak(rewardsRes.streak || 0);
        
        // Map badges correctly based on names
        const loadedBadges = Array.isArray(rewardsRes.badges) ? rewardsRes.badges.map((b: string) => ({
          id: b, name: b, icon: '🏆'
        })) : [];
        setUnlockedBadges(loadedBadges);

        setNudges(nudgesRes.nudges || []);
        
        setGoals(goalsRes.map((g: any) => ({
          id: g.id.toString(),
          name: g.title,
          amount: g.target,
          currentAmount: g.saved,
          deadline: g.deadline,
          purpose: 'Saved so far',
          color: 'from-blue-400 to-cyan-400'
        })));
        
        setSpendingCategories(spendingRes);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="absolute -left-2 -top-2"
        >
          <motion.span
            className="text-4xl"
            animate={{ 
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            👋
          </motion.span>
        </motion.div>
        <h1 className="text-3xl md:text-4xl pl-10">
          Hi <motion.span
            className="bg-gradient-to-r from-[#4BE1C3] to-[#FFBE98] bg-clip-text text-transparent inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {userName}
          </motion.span>
        </h1>
        <motion.p 
          className="text-gray-600 mt-2 text-lg pl-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Here's your Finova score!
        </motion.p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="flex gap-3 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            className="gap-2 whitespace-nowrap border-2 border-[#4BE1C3]/30 hover:bg-[#4BE1C3]/10 hover:border-[#4BE1C3] shadow-md hover:shadow-lg transition-all"
            onClick={() => onNavigate('transactions')}
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            className="gap-2 whitespace-nowrap border-2 border-[#FFBE98]/30 hover:bg-[#FFBE98]/10 hover:border-[#FFBE98] shadow-md hover:shadow-lg transition-all"
            onClick={() => onNavigate('chat')}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Ask Finova
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            className="gap-2 whitespace-nowrap border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 shadow-md hover:shadow-lg transition-all"
            onClick={() => onNavigate('goals')}
          >
            <Target className="w-4 h-4" />
            Set New Goal
          </Button>
        </motion.div>
      </motion.div>

      {/* Health Score */}
      <HealthScoreCard score={healthScore} />

      {/* Badges & Streak */}
      <motion.div 
        className="bg-gradient-to-br from-white via-[#4BE1C3]/5 to-white rounded-3xl p-6 shadow-lg border-2 border-[#4BE1C3]/20 relative overflow-hidden"
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFBE98]/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3>Your Achievements</h3>
          <motion.div 
            className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(251, 146, 60, 0.3)',
                '0 0 30px rgba(251, 146, 60, 0.5)',
                '0 0 20px rgba(251, 146, 60, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              className="text-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.span>
            <span className="text-sm font-semibold">{streak}-day streak!</span>
          </motion.div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 relative z-10">
          {unlockedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 whitespace-nowrap bg-gradient-to-r from-[#4BE1C3]/20 to-[#FFBE98]/20 border-2 border-[#4BE1C3]/30 hover:shadow-lg transition-all"
              >
                {badge.icon} {badge.name}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Smart Nudges */}
      <div className="space-y-3">
        <h3>Smart Nudges & Alerts</h3>
        {nudges.length === 0 && <p className="text-gray-500 text-sm">No new nudges. You're doing great!</p>}
        {nudges.map((nudge, idx) => (
          <NudgeCard key={nudge.id || idx} nudge={nudge} />
        ))}
      </div>

      {/* Spending Breakdown */}
      <SpendingChart data={spendingCategories} />

      {/* Goals Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Your Goals</h3>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('goals')}
            className="text-[#4BE1C3] hover:text-[#4BE1C3]/80"
          >
            View All
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {goals.length === 0 && <p className="text-gray-500 text-sm">No active goals yet. Start saving!</p>}
          {goals.slice(0, 2).map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Cashflow Forecast */}
      <CashflowChart />

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-[#4BE1C3] via-[#3DD4B6] to-[#FFBE98] rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-2xl"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.span
          className="text-5xl mb-4 block"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌱
        </motion.span>
        <h3 className="text-white mb-2 text-xl relative z-10">Your money grows when you do</h3>
        <p className="text-white/90 mb-4 relative z-10">
          Keep tracking, learning, and saving to unlock more rewards!
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="secondary" 
            onClick={() => onNavigate('insights')}
            className="bg-white text-[#0E141B] hover:bg-white/90 shadow-lg relative z-10"
          >
            Explore Insights ✨
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
