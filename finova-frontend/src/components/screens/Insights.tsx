import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { learningTopics, fetchMarketSummary, fetchBehavior } from '../../lib/api';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface StockData {
  name: string;
  symbol: string;
  current_price: number;
  percent_change: number;
  trend: string;
}

export function Insights() {
  const [sipAmount, setSipAmount] = useState('5000');
  const [sipDuration, setSipDuration] = useState('10');
  const [sipReturn, setSipReturn] = useState('12');
  const [allocation, setAllocation] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  
  const [marketData, setMarketData] = useState<StockData[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);
  const [behaviorMessage, setBehaviorMessage] = useState<string>("Loading behavior analytics...");

  useEffect(() => {
    async function loadMarket() {
      try {
        const data = await fetchMarketSummary();
        if (data.summary) {
          setMarketData(data.summary);
        }
      } catch (err) {
        console.error("Failed to load market data", err);
      } finally {
        setMarketLoading(false);
      }
    }
    loadMarket();
    
    async function loadBehavior() {
       try {
           const data = await fetchBehavior();
           if (data.message) {
               setBehaviorMessage(data.message.replace('📊 Behavioral Analytics\\n', '').replace('📊 Behavioral Analytics\n', ''));
           }
       } catch (err) {
           console.error("Failed to load behavior data", err);
           setBehaviorMessage("Unable to load insights right now. Please test again later.");
       }
    }
    loadBehavior();
  }, []);

  const calculateSIP = () => {
    const P = parseFloat(sipAmount);
    const n = parseFloat(sipDuration) * 12;
    const r = parseFloat(sipReturn) / 100 / 12;
    
    const futureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = P * n;
    const returns = futureValue - invested;
    
    return { futureValue, invested, returns };
  };

  const sipResult = calculateSIP();

  const sipChartData = Array.from({ length: parseInt(sipDuration) + 1 }, (_, i) => {
    const months = i * 12;
    const P = parseFloat(sipAmount);
    const r = parseFloat(sipReturn) / 100 / 12;
    const fv = months === 0 ? 0 : P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    
    return {
      year: i,
      invested: P * months,
      value: Math.round(fv)
    };
  });

  const allocations = {
    conservative: { equity: 30, debt: 60, gold: 10 },
    balanced: { equity: 50, debt: 40, gold: 10 },
    aggressive: { equity: 70, debt: 25, gold: 5 }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Insights & Investment Education</h1>
        <p className="text-gray-600 mt-1">Learn investing visually</p>
      </motion.div>

      {/* SIP Simulator */}
      <Card className="border-2 border-[#4BE1C3]/30">
        <CardHeader>
          <CardTitle>SIP Calculator 📊</CardTitle>
          <CardDescription>Simulate your investment journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="amount">Monthly Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (Years)</Label>
              <Input
                id="duration"
                type="number"
                value={sipDuration}
                onChange={(e) => setSipDuration(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="return">Expected Return (%)</Label>
              <Input
                id="return"
                type="number"
                value={sipReturn}
                onChange={(e) => setSipReturn(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl mt-1">₹{sipResult.invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Returns</p>
              <p className="text-2xl mt-1 text-green-600">₹{sipResult.returns.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="bg-[#4BE1C3]/20 rounded-2xl p-4">
              <p className="text-sm text-gray-600">Future Value</p>
              <p className="text-2xl mt-1 text-[#4BE1C3]">₹{sipResult.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sipChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="invested" stackId="1" stroke="#60A5FA" fill="#60A5FA" name="Invested" />
              <Area type="monotone" dataKey="value" stackId="2" stroke="#4BE1C3" fill="#4BE1C3" name="Returns" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation Strategy</CardTitle>
          <CardDescription>Choose your risk profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={allocation} onValueChange={(v) => setAllocation(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conservative">Conservative</TabsTrigger>
              <TabsTrigger value="balanced">Balanced</TabsTrigger>
              <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
            </TabsList>
            <TabsContent value={allocation} className="mt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">📈 Equity</span>
                      <span className="text-sm">{allocations[allocation].equity}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4BE1C3]"
                        style={{ width: `${allocations[allocation].equity}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">💰 Debt</span>
                      <span className="text-sm">{allocations[allocation].debt}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFBE98]"
                        style={{ width: `${allocations[allocation].debt}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">🥇 Gold</span>
                      <span className="text-sm">{allocations[allocation].gold}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${allocations[allocation].gold}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Market Trends</CardTitle>
          <CardDescription>Live educational intelligence (Nifty, S&P 500, Gold, BTC)</CardDescription>
        </CardHeader>
        <CardContent>
          {marketLoading ? (
            <div className="flex items-center justify-center p-6 text-gray-500">
               <Loader2 className="w-6 h-6 animate-spin mr-2" />
               Loading market data...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              {marketData.length > 0 ? marketData.map((stock) => (
                <div key={stock.symbol} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex flex-col mb-3">
                    <span className="font-semibold">{stock.name}</span>
                    <span className="text-sm text-gray-500">{stock.symbol}</span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                     <span className="text-xl font-bold">${stock.current_price}</span>
                     <span className={`flex items-center gap-1 text-sm ${
                       stock.trend === 'up' ? 'text-green-600' : 'text-red-600'
                     }`}>
                       {stock.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                       {stock.percent_change > 0 ? '+' : ''}{stock.percent_change}%
                     </span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500">No market data available.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Behavioral Analytics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200"
      >
        <h3 className="mb-2">📊 Behavioral Analytics</h3>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {behaviorMessage}
        </p>
      </motion.div>

      {/* Learning Cards */}
      <div>
        <h3 className="mb-4">Finova Learn 📚</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {learningTopics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl p-6 shadow-lg cursor-pointer"
            >
              <div className="text-4xl mb-3">{topic.emoji}</div>
              <h4 className="mb-2">{topic.title}</h4>
              <p className="text-sm text-gray-600">{topic.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
