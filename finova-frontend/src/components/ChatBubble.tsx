import { motion } from 'motion/react';
import { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isTyping?: boolean;
}

export function ChatBubble({ message, isTyping }: ChatBubbleProps) {
  const isAI = message.type === 'ai';

  if (isTyping) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#4BE1C3] flex items-center justify-center text-white">
          🤖
        </div>
        <div className="bg-[#4BE1C3]/10 rounded-2xl rounded-tl-sm p-4">
          <div className="flex gap-1">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-[#4BE1C3] rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-[#4BE1C3] rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-[#4BE1C3] rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 mb-4 ${!isAI ? 'flex-row-reverse' : ''}`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-[#4BE1C3] flex items-center justify-center text-white shrink-0">
          🤖
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          isAI
            ? 'bg-[#4BE1C3]/10 rounded-tl-sm'
            : 'bg-white rounded-tr-sm shadow-sm'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-gray-400 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-[#FFBE98] flex items-center justify-center text-white shrink-0">
          👤
        </div>
      )}
    </motion.div>
  );
}
