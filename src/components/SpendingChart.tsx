import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { SpendingCategory } from '../types';

interface SpendingChartProps {
  data: SpendingCategory[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.map(cat => ({
    name: `${cat.emoji} ${cat.name}`,
    value: cat.amount,
    color: cat.color
  }));

  return (
    <motion.div 
      className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#4BE1C3]/20 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FFBE98]/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3>Spending Breakdown</h3>
        <motion.span
          className="text-2xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          📊
        </motion.span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `₹${value.toLocaleString()}`}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '2px solid #4BE1C3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-6 space-y-2 relative z-10">
        {data.map((cat, index) => (
          <motion.div 
            key={cat.name} 
            className="flex items-center justify-between text-sm p-3 rounded-xl hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-4 h-4 rounded-full shadow-lg" 
                style={{ backgroundColor: cat.color }}
                whileHover={{ scale: 1.3 }}
              />
              <span className="font-medium">{cat.emoji} {cat.name}</span>
            </div>
            <span className="font-semibold">₹{cat.amount.toLocaleString()} ({cat.percentage}%)</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
