import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'motion/react';
import { TrendingDown } from 'lucide-react';

const forecastData = [
  { day: 'Today', balance: 25000 },
  { day: '7d', balance: 22000 },
  { day: '14d', balance: 19500 },
  { day: '21d', balance: 17800 },
  { day: '30d', balance: 15200 },
];

export function CashflowChart() {
  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#4BE1C3]/20 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <motion.div
        className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4BE1C3]/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3>30-Day Cashflow Forecast</h3>
        <motion.div
          className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingDown className="w-4 h-4" />
          <span>-39%</span>
        </motion.div>
      </div>
      
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={forecastData}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4BE1C3" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4BE1C3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="day" stroke="#666" style={{ fontSize: '12px' }} />
          <YAxis stroke="#666" style={{ fontSize: '12px' }} />
          <Tooltip 
            formatter={(value: number) => `₹${value.toLocaleString()}`}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '2px solid #4BE1C3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#4BE1C3"
            strokeWidth={3}
            fill="url(#colorBalance)"
            dot={{ fill: '#4BE1C3', r: 6, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <motion.p 
        className="text-xs text-gray-500 mt-3 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        💡 Projected based on your spending patterns
      </motion.p>
    </motion.div>
  );
}
