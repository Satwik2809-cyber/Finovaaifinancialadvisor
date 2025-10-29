import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/screens/Dashboard';
import { Transactions } from './components/screens/Transactions';
import { Goals } from './components/screens/Goals';
import { Chat } from './components/screens/Chat';
import { Insights } from './components/screens/Insights';
import { Rewards } from './components/screens/Rewards';
import { Profile } from './components/screens/Profile';
import { QuizPopup } from './components/QuizPopup';
import { Toaster } from './components/ui/sonner';

type Screen = 'home' | 'transactions' | 'goals' | 'chat' | 'insights' | 'rewards' | 'profile';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [showQuiz, setShowQuiz] = useState(false);
  const [hasSeenQuizToday, setHasSeenQuizToday] = useState(false);

  // Show daily quiz after 3 seconds on first load
  useEffect(() => {
    if (!hasSeenQuizToday) {
      const timer = setTimeout(() => {
        setShowQuiz(true);
        setHasSeenQuizToday(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenQuizToday]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Dashboard onNavigate={setActiveScreen} />;
      case 'transactions':
        return <Transactions />;
      case 'goals':
        return <Goals />;
      case 'chat':
        return <Chat />;
      case 'insights':
        return <Insights />;
      case 'rewards':
        return <Rewards />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Daily Tip Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-[#4BE1C3] via-[#3DD4B6] to-[#FFBE98] text-white py-3 px-4 text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <p className="relative z-10 flex items-center justify-center gap-2">
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💡
          </motion.span>
          <span className="text-sm md:text-base">
            Today's Tip: The difference between saving and investing? Saving is for short-term goals, investing builds long-term wealth!
          </span>
        </p>
      </motion.div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 p-6 border-r border-gray-200 min-h-screen sticky top-0 bg-white/50 backdrop-blur-sm">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4BE1C3] to-[#FFBE98] flex items-center justify-center text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xl">💰</span>
              </motion.div>
              <h2 className="text-2xl bg-gradient-to-r from-[#4BE1C3] to-[#FFBE98] bg-clip-text text-transparent">
                Finova
              </h2>
            </div>
            <p className="text-sm text-gray-600">Smarter Money. Simple Living.</p>
          </motion.div>
          <BottomNav activeTab={activeScreen} onTabChange={setActiveScreen} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav activeTab={activeScreen} onTabChange={setActiveScreen} />
      </div>

      {/* Quiz Popup */}
      {showQuiz && <QuizPopup onClose={() => setShowQuiz(false)} />}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
