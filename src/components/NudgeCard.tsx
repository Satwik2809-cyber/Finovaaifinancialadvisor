import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Nudge } from '../types';

interface NudgeCardProps {
  nudge: Nudge;
}

export function NudgeCard({ nudge }: NudgeCardProps) {
  const getIcon = () => {
    switch (nudge.type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (nudge.type) {
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5, scale: 1.01 }}
      className={`rounded-2xl p-4 border-2 ${getBgColor()} flex items-start gap-3 cursor-pointer transition-all hover:shadow-md relative overflow-hidden`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {getIcon()}
      </motion.div>
      <p className="flex-1 text-sm relative z-10">{nudge.message}</p>
    </motion.div>
  );
}
