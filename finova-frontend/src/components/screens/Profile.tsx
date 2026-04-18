import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { User, Bell, Shield, Download, Trash2 } from 'lucide-react';
import { ChatTone } from '../../types';

export function Profile() {
  const [userName, setUserName] = useState('Satwik');
  const [currency, setCurrency] = useState('INR');
  const [chatTone, setChatTone] = useState<ChatTone>('coach');
  const [notifications, setNotifications] = useState(true);
  const [dailyTips, setDailyTips] = useState(true);
  const [blurAmounts, setBlurAmounts] = useState(false);
  const [foodTarget, setFoodTarget] = useState('20');
  const [travelTarget, setTravelTarget] = useState('15');
  const [shoppingTarget, setShoppingTarget] = useState('25');

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1>Profile & Settings</h1>
        <p className="text-gray-600 mt-1">Customize your Finova experience</p>
      </motion.div>

      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-[#4BE1C3] via-[#3DD4B6] to-cyan-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl"
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-white text-[#4BE1C3] text-3xl font-bold">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h2 className="text-white text-2xl">{userName}</h2>
            <motion.p 
              className="text-white/90 text-sm flex items-center gap-2 mt-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-white/20 px-2 py-1 rounded-full">Level 3</span>
              <span>·</span>
              <span>750 XP ⭐</span>
            </motion.p>
            <p className="text-white/70 text-xs mt-1">Member since Oct 2025</p>
          </div>
        </div>
      </motion.div>

      {/* Personal Details */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#4BE1C3]" />
          <h3>Personal Details</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                <SelectItem value="EUR">€ EUR - Euro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tone">Chatbot Tone</Label>
            <Select value={chatTone} onValueChange={(v) => setChatTone(v as ChatTone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coach">💪 Coach (Motivational)</SelectItem>
                <SelectItem value="bestie">🤗 Bestie (Friendly)</SelectItem>
                <SelectItem value="professor">🎓 Professor (Educational)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Category Targets */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h3 className="mb-4">Category Budget Targets (%)</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="food">🍔 Food</Label>
            <Input
              id="food"
              type="number"
              value={foodTarget}
              onChange={(e) => setFoodTarget(e.target.value)}
              placeholder="20"
            />
          </div>
          <div>
            <Label htmlFor="travel">🚕 Travel</Label>
            <Input
              id="travel"
              type="number"
              value={travelTarget}
              onChange={(e) => setTravelTarget(e.target.value)}
              placeholder="15"
            />
          </div>
          <div>
            <Label htmlFor="shopping">🛍️ Shopping</Label>
            <Input
              id="shopping"
              type="number"
              value={shoppingTarget}
              onChange={(e) => setShoppingTarget(e.target.value)}
              placeholder="25"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-[#4BE1C3]" />
          <h3>Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Push Notifications</p>
              <p className="text-xs text-gray-600">Get alerts for spending and goals</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Daily Finance Tips</p>
              <p className="text-xs text-gray-600">Receive learning content daily</p>
            </div>
            <Switch checked={dailyTips} onCheckedChange={setDailyTips} />
          </div>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-[#4BE1C3]" />
          <h3>Privacy & Data</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Blur Amounts (Demo Mode)</p>
              <p className="text-xs text-gray-600">Hide financial amounts on screen</p>
            </div>
            <Switch checked={blurAmounts} onCheckedChange={setBlurAmounts} />
          </div>
          <Separator />
          <Button variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Export My Data (ZIP)
          </Button>
          <Button variant="outline" className="w-full gap-2 text-red-600 hover:text-red-700 border-red-200">
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </Button>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-yellow-50 rounded-3xl p-6 border-2 border-yellow-200"
      >
        <p className="text-sm text-gray-700">
          ⚠️ <strong>Important:</strong> Finova provides educational guidance only, not financial advice. 
          Always consult with a certified financial advisor before making investment decisions. 
          We do not collect PII or sensitive financial data.
        </p>
      </motion.div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Finova v1.0.0</p>
        <p className="text-xs">Smarter Money. Simple Living. 💚</p>
      </div>
    </div>
  );
}
