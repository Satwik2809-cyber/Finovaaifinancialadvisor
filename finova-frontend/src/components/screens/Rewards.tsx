import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fetchRewards } from '../../lib/api';
import { Badge as BadgeType } from '../../types';
import { BadgeCard } from '../BadgeCard';
import { Progress } from '../ui/progress';
import { Trophy, Flame } from 'lucide-react';

const motivationalQuotes = [
  "Your money grows when you do 🌱",
  "Small steps lead to big dreams 💫",
  "Consistency beats perfection 🎯",
  "Financial freedom starts today 🚀"
];

const ALL_BADGES = [
  { id: '1', name: 'First Upload', description: 'Uploaded your first transaction', icon: '📤' },
  { id: '2', name: 'Smart Saver', description: 'Saved for 7 consecutive days', icon: '💰' },
  { id: '3', name: 'Debt Dodger', description: 'Zero credit card debt for 30 days', icon: '🛡️' },
  { id: '4', name: 'Compound Captain', description: 'Completed 10 investment lessons', icon: '📈' },
  { id: '5', name: 'Budget Boss', description: 'Stayed within budget for 3 months', icon: '👑' },
  { id: '6', name: 'Goal Getter', description: 'Completed your first savings goal', icon: '🎯' },
];

export function Rewards() {
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchRewards();
        setStreak(data.streak || 0);
        setXp(data.xp || 0);
        setUnlockedBadges(data.badges || []);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const nextLevelXP = Math.max(100, Math.ceil(xp / 1000) * 1000);
  const level = Math.floor(xp / 1000) + 1;
  const unlockedCount = unlockedBadges.length;

  const displayBadges = ALL_BADGES.map(b => ({
    ...b,
    unlocked: unlockedBadges.includes(b.name) || false,
    unlockedDate: 'Recently'
  }));


  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-5xl"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🏆
          </motion.span>
          <div>
            <h1 className="text-3xl md:text-4xl">Rewards Center</h1>
            <p className="text-gray-600 mt-1">Track your achievements and progress</p>
          </div>
        </div>
      </motion.div>

      {/* XP & Level */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-[#4BE1C3] via-[#3DD4B6] to-cyan-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <p className="text-white/90 text-sm">Current Level</p>
              <motion.p 
                className="text-5xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                Level {level}
              </motion.p>
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-20 h-20 text-white/20" />
            </motion.div>
          </div>
          <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{xp} XP</span>
              <span className="font-semibold">{nextLevelXP} XP</span>
            </div>
            <Progress value={(xp / nextLevelXP) * 100} className="bg-white/30 h-3" />
            <p className="text-sm text-white/90">🎯 {nextLevelXP - xp} XP to next level</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#FFBE98] via-orange-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
        >
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <p className="text-white/90 text-sm">Current Streak</p>
              <motion.p 
                className="text-5xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                {streak} Days
              </motion.p>
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className="w-20 h-20 text-white/20" />
            </motion.div>
          </div>
          <p className="text-sm text-white/90 relative z-10">
            🔥 You're on fire! Keep logging in daily to maintain your streak and earn bonus XP.
          </p>
        </motion.div>
      </div>

      {/* Progress Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 shadow-lg"
      >
        <h3 className="mb-4">Your Progress</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl mb-1">{unlockedCount}/{ALL_BADGES.length}</p>
            <p className="text-sm text-gray-600">Badges Unlocked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">{xp}</p>
            <p className="text-sm text-gray-600">Total XP Earned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl mb-1">{streak}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>
      </motion.div>

      {/* Badge Gallery */}
      <div>
        <h3 className="mb-4">Badge Gallery</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BadgeCard badge={badge} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Motivational Quotes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-xl"
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
        <motion.p 
          className="text-5xl mb-4 relative z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💫
        </motion.p>
        <motion.p
          key={motivationalQuotes[0]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl mb-2 relative z-10 font-semibold"
        >
          {motivationalQuotes[0]}
        </motion.p>
        <p className="text-sm text-white/90 relative z-10">Keep going, champion!</p>
      </motion.div>

      {/* Daily Challenges */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h3 className="mb-4">Daily Challenges 🎯</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm">Log a transaction</p>
                <p className="text-xs text-gray-600">+10 XP</p>
              </div>
            </div>
            <span className="text-green-600 text-sm">Complete</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-sm">Complete daily quiz</p>
                <p className="text-xs text-gray-600">+15 XP</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm">Pending</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm">Add ₹100 to savings goal</p>
                <p className="text-xs text-gray-600">+20 XP</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
