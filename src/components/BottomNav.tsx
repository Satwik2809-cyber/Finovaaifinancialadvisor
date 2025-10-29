import { Home, Receipt, Target, MessageCircle, TrendingUp, Trophy, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'transactions', icon: Receipt, label: 'Transactions' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'insights', icon: TrendingUp, label: 'Insights' },
    { id: 'rewards', icon: Trophy, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:relative md:border-0 md:bg-transparent md:px-0 md:py-0">
      <div className="flex justify-around items-center md:flex-col md:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 py-2 px-3 transition-colors md:flex-row md:w-full md:justify-start md:rounded-xl md:hover:bg-[#4BE1C3]/10"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#4BE1C3]/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 ${
                  isActive ? 'text-[#4BE1C3]' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xs relative z-10 md:text-sm ${
                  isActive ? 'text-[#4BE1C3]' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
