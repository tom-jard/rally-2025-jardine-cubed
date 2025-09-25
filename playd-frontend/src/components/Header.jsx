import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Flame } from 'lucide-react';

const Header = ({ user, coinBalance, streak }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <span className="username">{user?.username || 'Player'}</span>
        </div>

        <div className="stats-container">
          <motion.div
            className="coin-balance"
            key={coinBalance}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Coins className="icon" />
            <span className="balance-text">{coinBalance.toLocaleString()}</span>
          </motion.div>

          <div className="streak-counter">
            <Flame className="icon flame" />
            <span className="streak-text">{streak}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;