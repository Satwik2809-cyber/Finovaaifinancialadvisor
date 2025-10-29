import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChatMessage, ChatTone } from '../../types';
import { ChatBubble } from '../ChatBubble';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Send, Mic } from 'lucide-react';
import { quickQuestions } from '../../lib/mockData';

const aiResponses: Record<string, string> = {
  'What is SIP?': 'SIP (Systematic Investment Plan) is a way to invest a fixed amount regularly in mutual funds. It helps build wealth through rupee cost averaging and compounding. Start with as little as ₹500/month!',
  'How can I budget ₹10,000?': 'Here\'s a smart breakdown using the 50/30/20 rule:\n• ₹5,000 (50%) - Needs (food, transport)\n• ₹3,000 (30%) - Wants (entertainment, dining out)\n• ₹2,000 (20%) - Savings/Investments\nAdjust based on your priorities!',
  'Why did my health score drop?': 'Your score dropped because:\n1. Food spending increased by 35% this week\n2. You spent 70% of your budget by the 10th\n3. No savings added in the last 7 days\n\nTip: Set up automatic savings transfers!',
  "What's the 50/30/20 rule?": 'The 50/30/20 rule is a simple budgeting framework:\n• 50% of income → Needs (rent, utilities, groceries)\n• 30% → Wants (dining out, hobbies, entertainment)\n• 20% → Savings & Investments\nIt helps balance lifestyle with financial security!'
};

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hey there! I\'m Finova, your AI financial mentor. How can I help you grow your wealth today? 🌱',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState<ChatTone>('coach');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = aiResponses[message] || 
        `That's a great question! As your ${tone}, I'd say: Focus on building good financial habits. Track your expenses, save regularly, and invest wisely. Remember, small steps lead to big results! 💪`;

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] pb-20 md:pb-0">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1>Ask Finova 💬</h1>
        <p className="text-gray-600 mt-1">Your AI financial mentor</p>
      </motion.div>

      {/* Tone Selector */}
      <motion.div 
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-4 shadow-lg mb-4 border-2 border-transparent hover:border-[#4BE1C3]/20 transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Select Tone:</span>
          <div className="flex gap-2 flex-1 overflow-x-auto">
            <motion.button
              onClick={() => setTone('coach')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                tone === 'coach' 
                  ? 'bg-gradient-to-r from-[#4BE1C3] to-cyan-500 text-white border-[#4BE1C3] shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#4BE1C3]/50'
              }`}
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-orange-500 text-white text-xs">💪</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Coach</span>
            </motion.button>
            
            <motion.button
              onClick={() => setTone('bestie')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                tone === 'bestie' 
                  ? 'bg-gradient-to-r from-[#FFBE98] to-orange-400 text-white border-[#FFBE98] shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#FFBE98]/50'
              }`}
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-pink-500 text-white text-xs">🤗</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Bestie</span>
            </motion.button>
            
            <motion.button
              onClick={() => setTone('professor')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                tone === 'professor' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-500 shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-500/50'
              }`}
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-blue-500 text-white text-xs">🎓</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Professor</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickQuestions.map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => handleSend(question)}
              className="whitespace-nowrap"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-3xl p-6 shadow-lg overflow-y-auto mb-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isTyping && <ChatBubble message={{ id: 'typing', type: 'ai', content: '', timestamp: new Date() }} isTyping />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white rounded-3xl p-4 shadow-lg">
        <div className="flex gap-3">
          <Input
            placeholder="Ask me anything about finance..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            className="shrink-0"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => handleSend(inputValue)}
            className="bg-[#4BE1C3] hover:bg-[#4BE1C3]/90 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          💡 Educational purpose only - not financial advice
        </p>
      </div>
    </div>
  );
}
