import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GamesTab from './components/GamesTab';
import EarnTab from './components/EarnTab';
import Header from './components/Header';
import TabBar from './components/TabBar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('games');
  const [user, setUser] = useState(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    try {
      const response = await fetch('/api/auth/gamecenter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamPlayerId: 'DEMO_PLAYER_001',
          username: 'DemoPlayer'
        })
      });

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('token', data.token);
      fetchBalance();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/coins/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCoinBalance(data.balance);
      setStreak(data.streak);
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  const handleCoinUpdate = (newBalance) => {
    setCoinBalance(newBalance);
  };

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loading-content">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-icon"
          >
            💰
          </motion.div>
          <h2>Play'd</h2>
          <p>Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        user={user}
        coinBalance={coinBalance}
        streak={streak}
      />

      <main className="app-content">
        <AnimatePresence mode="wait">
          {activeTab === 'games' ? (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <GamesTab
                coinBalance={coinBalance}
                onCoinUpdate={handleCoinUpdate}
              />
            </motion.div>
          ) : (
            <motion.div
              key="earn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <EarnTab
                onCoinUpdate={handleCoinUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App
