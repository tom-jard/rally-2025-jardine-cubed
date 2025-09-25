import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, Calculator, DollarSign } from 'lucide-react';

const GamesTab = ({ coinBalance, onCoinUpdate }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redemptionAmount, setRedemptionAmount] = useState({});
  const [showSuccess, setShowSuccess] = useState(null);
  const [streakClaimed, setStreakClaimed] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data);

      const initialAmounts = {};
      data.forEach(game => {
        initialAmounts[game.id] = game.conversion_rate;
      });
      setRedemptionAmount(initialAmounts);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (gameId) => {
    const amount = redemptionAmount[gameId];
    if (amount > coinBalance) {
      alert('Insufficient coins!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId,
          coinsToSpend: amount
        })
      });

      const data = await response.json();
      if (data.success) {
        onCoinUpdate(data.new_balance);
        setShowSuccess(gameId);
        setTimeout(() => setShowSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Redemption error:', error);
    }
  };

  const claimStreak = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/streak/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        onCoinUpdate(data.new_balance);
        setStreakClaimed(true);
      }
    } catch (error) {
      console.error('Streak claim error:', error);
    }
  };

  if (loading) {
    return <div className="tab-content">Loading games...</div>;
  }

  return (
    <div className="games-tab">
      <motion.div
        className="daily-streak-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="streak-content">
          <div className="streak-info">
            <Zap className="streak-icon" />
            <div>
              <h3>Daily Streak Bonus</h3>
              <p>Keep your streak alive!</p>
            </div>
          </div>
          <motion.button
            className={`claim-button ${streakClaimed ? 'claimed' : ''}`}
            onClick={claimStreak}
            disabled={streakClaimed}
            whileHover={!streakClaimed ? { scale: 1.05 } : {}}
            whileTap={!streakClaimed ? { scale: 0.95 } : {}}
          >
            {streakClaimed ? (
              <>
                <Check size={16} /> Claimed
              </>
            ) : (
              'Claim 120 ⭐'
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="section-header">
        <h2>Games You'll Love</h2>
        <p>Redeem your Play'd Coins for in-game currency</p>
      </div>

      <div className="games-grid">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            className="game-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="game-header">
              <div className="game-icon">{game.icon}</div>
              <div className="game-info">
                <h3>{game.name}</h3>
                <p className="conversion-rate">
                  {game.conversion_rate} coins = 1 {game.name === 'Monopoly GO' ? 'Dice Roll' : 'Item'}
                </p>
              </div>
            </div>

            <div className="game-meta">
              <span className="connected-badge">
                <Check size={14} /> Connected
              </span>
              <span className="value-badge">
                <DollarSign size={14} /> ${game.dollar_value.toFixed(2)} value
              </span>
            </div>

            <div className="redemption-controls">
              <div className="amount-selector">
                <button
                  className="amount-btn"
                  onClick={() => setRedemptionAmount({
                    ...redemptionAmount,
                    [game.id]: Math.max(game.conversion_rate, redemptionAmount[game.id] - game.conversion_rate)
                  })}
                >
                  -
                </button>
                <span className="amount-display">
                  {redemptionAmount[game.id]} coins
                </span>
                <button
                  className="amount-btn"
                  onClick={() => setRedemptionAmount({
                    ...redemptionAmount,
                    [game.id]: redemptionAmount[game.id] + game.conversion_rate
                  })}
                >
                  +
                </button>
              </div>

              <div className="redemption-info">
                <Calculator size={14} />
                <span>{Math.floor(redemptionAmount[game.id] / game.conversion_rate)} items</span>
              </div>

              <motion.button
                className="redeem-button"
                onClick={() => handleRedeem(game.id)}
                disabled={redemptionAmount[game.id] > coinBalance}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Redeem
              </motion.button>
            </div>

            <AnimatePresence>
              {showSuccess === game.id && (
                <motion.div
                  className="success-overlay"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Check className="success-icon" />
                  <p>Redeemed Successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamesTab;