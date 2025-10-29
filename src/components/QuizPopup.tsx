import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface QuizPopupProps {
  onClose: () => void;
}

const quizQuestions = [
  {
    question: 'What does SIP stand for?',
    options: ['Systematic Investment Plan', 'Simple Interest Payment'],
    correctAnswer: 0
  },
  {
    question: 'What is the 50/30/20 budget rule?',
    options: ['50% needs, 30% wants, 20% savings', '50% savings, 30% needs, 20% wants'],
    correctAnswer: 0
  }
];

export function QuizPopup({ onClose }: QuizPopupProps) {
  const [currentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setIsCorrect(index === question.correctAnswer);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h3>💡 Daily Quiz</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mb-6">{question.question}</p>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : 'border-gray-200 hover:border-[#4BE1C3]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl mb-4 ${
                isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {isCorrect ? '🎉 Correct! +10 XP earned' : '😅 Not quite! Try again tomorrow'}
            </motion.div>
          )}

          <Button onClick={onClose} className="w-full bg-[#4BE1C3] hover:bg-[#4BE1C3]/90">
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
