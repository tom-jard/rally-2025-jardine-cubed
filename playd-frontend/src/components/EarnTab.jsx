import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Target, BookOpen, Heart, ChevronRight, Check } from 'lucide-react';

const EarnTab = ({ onCoinUpdate }) => {
  const [challenges, setChallenges] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [expandedCategory, setExpandedCategory] = useState('Finance');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challengeId) => {
    if (completedChallenges.has(challengeId)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/actions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ challengeId })
      });

      const data = await response.json();
      if (data.success) {
        onCoinUpdate(data.new_balance);
        setCompletedChallenges(new Set([...completedChallenges, challengeId]));

        setTimeout(() => {
          const audio = new Audio('data:audio/wav;base64,UklGRioAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoAAADggP4A');
          audio.play().catch(() => {});
        }, 100);
      }
    } catch (error) {
      console.error('Challenge completion error:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Finance': return '🏦';
      case 'Health': return '🏃';
      case 'Learning': return '🎓';
      default: return '⭐';
    }
  };

  const getPartnerLogo = (partner) => {
    const logos = {
      'SoFi': '🏦',
      'Fitbit': '⌚',
      'Coursera': '📚'
    };
    return logos[partner] || '🎯';
  };

  if (loading) {
    return <div className="tab-content">Loading challenges...</div>;
  }

  const todayProgress = Object.values(challenges)
    .flat()
    .filter(c => completedChallenges.has(c.id))
    .reduce((sum, c) => sum + c.coins_reward, 0);

  const dailyGoal = 500;

  return (
    <div className="earn-tab">
      <motion.div
        className="progress-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>Your Progress Today</h3>
        <div className="progress-bar-container">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((todayProgress / dailyGoal) * 100, 100)}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
        <p className="progress-text">
          {todayProgress} of {dailyGoal} coins earned
        </p>
      </motion.div>

      <div className="challenges-container">
        {Object.entries(challenges).map(([category, categoryChalls]) => (
          <div key={category} className="category-section">
            <motion.button
              className="category-header"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="category-title">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <h3>{category.toUpperCase()}</h3>
                <span className="challenge-count">{categoryChalls.length}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedCategory === category ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expandedCategory === category && (
                <motion.div
                  className="category-challenges"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {categoryChalls.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      className={`challenge-card ${completedChallenges.has(challenge.id) ? 'completed' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="challenge-content">
                        <div className="partner-badge">
                          <span className="partner-logo">{getPartnerLogo(challenge.partner)}</span>
                          <span className="partner-name">{challenge.partner}</span>
                        </div>

                        <div className="challenge-details">
                          <h4>{challenge.title}</h4>
                          <p>{challenge.description}</p>
                        </div>

                        <div className="reward-section">
                          <div className="coin-reward">
                            <Award className="reward-icon" />
                            <span>{challenge.coins_reward} coins</span>
                          </div>

                          <motion.button
                            className={`action-button ${completedChallenges.has(challenge.id) ? 'completed' : ''}`}
                            onClick={() => completeChallenge(challenge.id)}
                            disabled={completedChallenges.has(challenge.id)}
                            whileHover={!completedChallenges.has(challenge.id) ? { scale: 1.05 } : {}}
                            whileTap={!completedChallenges.has(challenge.id) ? { scale: 0.95 } : {}}
                          >
                            {completedChallenges.has(challenge.id) ? (
                              <>
                                <Check size={16} /> Completed
                              </>
                            ) : (
                              'Start Challenge'
                            )}
                          </motion.button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {completedChallenges.has(challenge.id) && (
                          <motion.div
                            className="completion-badge"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Check />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="partner-callout">
        <h3>🎯 More Partners Coming Soon!</h3>
        <p>Duolingo, Peloton, Khan Academy, and more</p>
      </div>
    </div>
  );
};

export default EarnTab;