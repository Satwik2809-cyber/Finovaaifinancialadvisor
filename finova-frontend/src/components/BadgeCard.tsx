import { motion } from 'motion/react';
import { Badge } from '../types';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: badge.unlocked ? 1.1 : 1,
        rotate: badge.unlocked ? [0, -5, 5, 0] : 0,
      }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`rounded-2xl p-6 text-center cursor-pointer relative overflow-hidden ${
        badge.unlocked
          ? 'bg-gradient-to-br from-[#4BE1C3]/20 via-[#3DD4B6]/15 to-[#FFBE98]/20 border-2 border-[#4BE1C3]/30 shadow-lg hover:shadow-xl'
          : 'bg-gray-100 border-2 border-gray-200'
      }`}
    >
      {badge.unlocked && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FFBE98]/30 to-transparent rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </>
      )}
      
      <motion.div 
        className="text-6xl mb-3 relative z-10"
        animate={badge.unlocked ? {
          y: [0, -10, 0],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
      >
        {badge.unlocked ? (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {badge.icon}
          </motion.span>
        ) : (
          <div className="relative inline-block opacity-30 filter grayscale">
            <span>{badge.icon}</span>
            <Lock className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600" />
          </div>
        )}
      </motion.div>
      
      <h4 className={`relative z-10 ${badge.unlocked ? 'text-[#0E141B] font-semibold' : 'text-gray-400'}`}>
        {badge.name}
      </h4>
      <p className={`text-sm mt-2 relative z-10 ${badge.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {badge.description}
      </p>
      {badge.unlocked && badge.unlockedDate && (
        <motion.p 
          className="text-xs text-[#4BE1C3] mt-3 bg-[#4BE1C3]/10 rounded-full px-3 py-1 inline-block relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ✨ Unlocked: {new Date(badge.unlockedDate).toLocaleDateString()}
        </motion.p>
      )}
    </motion.div>
  );
}
