import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy } from 'lucide-react';

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="tab-bar">
      <button
        className={`tab-button ${activeTab === 'games' ? 'active' : ''}`}
        onClick={() => onTabChange('games')}
      >
        <Gamepad2 className="tab-icon" />
        <span className="tab-label">Games</span>
        {activeTab === 'games' && (
          <motion.div
            className="active-indicator"
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      <button
        className={`tab-button ${activeTab === 'earn' ? 'active' : ''}`}
        onClick={() => onTabChange('earn')}
      >
        <Trophy className="tab-icon" />
        <span className="tab-label">Earn</span>
        {activeTab === 'earn' && (
          <motion.div
            className="active-indicator"
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    </nav>
  );
};

export default TabBar;