import { motion } from 'motion/react';

interface HealthScoreCardProps {
  score: number;
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '😎';
    if (score >= 60) return '🙂';
    return '😬';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4BE1C3';
    if (score >= 60) return '#FFBE98';
    return '#F87171';
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#4BE1C3]/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4BE1C3]/10 to-transparent rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3>Financial Health Score</h3>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <span className="text-2xl">🎯</span>
        </motion.div>
      </div>
      
      <div className="flex items-center justify-center relative z-10">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90 drop-shadow-lg">
            {/* Outer glow circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke={getScoreColor(score)}
              strokeWidth="2"
              fill="none"
              opacity="0.1"
            />
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="70"
              stroke="#F6F8FB"
              strokeWidth="14"
              fill="none"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="70"
              stroke={getScoreColor(score)}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              filter="drop-shadow(0 0 8px rgba(75, 225, 195, 0.4))"
            />
          </svg>
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <motion.span 
              className="text-5xl mb-2"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getScoreEmoji(score)}
            </motion.span>
            <motion.span 
              className="text-4xl font-bold"
              style={{ 
                color: getScoreColor(score),
                textShadow: `0 0 20px ${getScoreColor(score)}40`
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {score}
            </motion.span>
            <span className="text-sm text-gray-500 mt-1">{getScoreText(score)}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
