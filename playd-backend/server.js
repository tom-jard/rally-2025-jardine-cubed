const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'playd-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      team_player_id TEXT UNIQUE,
      username TEXT,
      coin_balance INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Actions table for tracking earned coins
  db.run(`
    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      partner TEXT,
      action_type TEXT,
      coins_earned INTEGER,
      description TEXT,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Redemptions table
  db.run(`
    CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      game_id TEXT,
      game_name TEXT,
      coins_spent INTEGER,
      game_currency_received INTEGER,
      redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Games table
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      name TEXT,
      icon TEXT,
      conversion_rate INTEGER,
      dollar_value REAL,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Challenges table
  db.run(`
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      partner TEXT,
      title TEXT,
      description TEXT,
      coins_reward INTEGER,
      category TEXT,
      icon TEXT,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Seed initial data
  seedDatabase();
});

// Helper function to generate UUIDs
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Seed database with initial data
function seedDatabase() {
  // Add sample games
  const games = [
    { id: 'monopoly-go', name: 'Monopoly GO', icon: '🎲', conversion_rate: 120, dollar_value: 1.00 },
    { id: 'madden-mobile', name: 'Madden Mobile', icon: '🏈', conversion_rate: 200, dollar_value: 1.50 },
    { id: 'candy-crush', name: 'Candy Crush', icon: '🍬', conversion_rate: 100, dollar_value: 0.80 }
  ];

  games.forEach(game => {
    db.run(
      'INSERT OR IGNORE INTO games (id, name, icon, conversion_rate, dollar_value) VALUES (?, ?, ?, ?, ?)',
      [game.id, game.name, game.icon, game.conversion_rate, game.dollar_value]
    );
  });

  // Add sample challenges
  const challenges = [
    {
      id: 'sofi-budget',
      partner: 'SoFi',
      title: 'Complete Monthly Budget Review',
      description: 'Review and categorize your monthly expenses',
      coins_reward: 500,
      category: 'Finance',
      icon: '🏦'
    },
    {
      id: 'sofi-savings',
      partner: 'SoFi',
      title: 'Save $100 This Month',
      description: 'Reach your monthly savings goal',
      coins_reward: 800,
      category: 'Finance',
      icon: '💰'
    },
    {
      id: 'fitbit-steps',
      partner: 'Fitbit',
      title: 'Complete Daily Step Goal',
      description: 'Walk 10,000 steps today',
      coins_reward: 100,
      category: 'Health',
      icon: '🏃'
    },
    {
      id: 'fitbit-workout',
      partner: 'Fitbit',
      title: 'Complete 30-Min Workout',
      description: 'Complete a high-intensity workout session',
      coins_reward: 200,
      category: 'Health',
      icon: '💪'
    },
    {
      id: 'coursera-finance',
      partner: 'Coursera',
      title: 'Financial Literacy 101',
      description: 'Complete one lesson in financial basics course',
      coins_reward: 300,
      category: 'Learning',
      icon: '🎓'
    },
    {
      id: 'coursera-investing',
      partner: 'Coursera',
      title: 'Introduction to Investing',
      description: 'Learn the basics of stock market investing',
      coins_reward: 400,
      category: 'Learning',
      icon: '📈'
    }
  ];

  challenges.forEach(challenge => {
    db.run(
      'INSERT OR IGNORE INTO challenges (id, partner, title, description, coins_reward, category, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [challenge.id, challenge.partner, challenge.title, challenge.description, challenge.coins_reward, challenge.category, challenge.icon]
    );
  });

  // Add a demo user
  const demoUserId = generateId();
  db.run(
    'INSERT OR IGNORE INTO users (id, team_player_id, username, coin_balance, streak_days) VALUES (?, ?, ?, ?, ?)',
    [demoUserId, 'DEMO_PLAYER_001', 'DemoPlayer', 10000, 7]
  );
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    // For demo, create a default user
    req.user = { id: 'demo-user', team_player_id: 'DEMO_PLAYER_001' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Play\'d backend is running!' });
});

// Auth endpoint - Mock Game Center authentication
app.post('/api/auth/gamecenter', (req, res) => {
  const { teamPlayerId, username } = req.body;

  // Check if user exists
  db.get('SELECT * FROM users WHERE team_player_id = ?', [teamPlayerId || 'DEMO_PLAYER_001'], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (user) {
      // User exists, return token
      const token = jwt.sign({ id: user.id, team_player_id: user.team_player_id }, JWT_SECRET);
      res.json({ token, user });
    } else {
      // Create new user
      const userId = generateId();
      const newUsername = username || `Player${Math.floor(Math.random() * 9999)}`;

      db.run(
        'INSERT INTO users (id, team_player_id, username, coin_balance) VALUES (?, ?, ?, ?)',
        [userId, teamPlayerId || generateId(), newUsername, 500], // Start with 500 bonus coins
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          db.get('SELECT * FROM users WHERE id = ?', [userId], (err, newUser) => {
            const token = jwt.sign({ id: newUser.id, team_player_id: newUser.team_player_id }, JWT_SECRET);
            res.json({ token, user: newUser });
          });
        }
      );
    }
  });
});

// Get user's coin balance
app.get('/api/coins/balance', authenticateToken, (req, res) => {
  db.get('SELECT coin_balance, streak_days FROM users WHERE team_player_id = ?',
    [req.user.team_player_id || 'DEMO_PLAYER_001'],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ balance: row?.coin_balance || 10000, streak: row?.streak_days || 7 });
    }
  );
});

// Get available games
app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games WHERE is_active = 1', (err, games) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(games);
  });
});

// Get available challenges
app.get('/api/challenges', (req, res) => {
  db.all('SELECT * FROM challenges WHERE is_active = 1', (err, challenges) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Group challenges by category
    const grouped = challenges.reduce((acc, challenge) => {
      if (!acc[challenge.category]) {
        acc[challenge.category] = [];
      }
      acc[challenge.category].push(challenge);
      return acc;
    }, {});

    res.json(grouped);
  });
});

// Complete an action and earn coins
app.post('/api/actions/complete', authenticateToken, (req, res) => {
  const { challengeId } = req.body;
  const userId = req.user.id || 'demo-user';

  // Get challenge details
  db.get('SELECT * FROM challenges WHERE id = ?', [challengeId], (err, challenge) => {
    if (err || !challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Record the action
    const actionId = generateId();
    db.run(
      'INSERT INTO actions (id, user_id, partner, action_type, coins_earned, description) VALUES (?, ?, ?, ?, ?, ?)',
      [actionId, userId, challenge.partner, challenge.id, challenge.coins_reward, challenge.title],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to record action' });
        }

        // Update user's coin balance
        db.run(
          'UPDATE users SET coin_balance = coin_balance + ? WHERE id = ?',
          [challenge.coins_reward, userId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update balance' });
            }

            // Get updated balance
            db.get('SELECT coin_balance FROM users WHERE id = ?', [userId], (err, user) => {
              res.json({
                success: true,
                coins_earned: challenge.coins_reward,
                new_balance: user?.coin_balance || challenge.coins_reward,
                message: `Earned ${challenge.coins_reward} Play'd Coins!`
              });
            });
          }
        );
      }
    );
  });
});

// Redeem coins for game currency
app.post('/api/redeem', authenticateToken, (req, res) => {
  const { gameId, coinsToSpend } = req.body;
  const userId = req.user.id || 'demo-user';

  // Get game details
  db.get('SELECT * FROM games WHERE id = ?', [gameId], (err, game) => {
    if (err || !game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check user balance
    db.get('SELECT coin_balance FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user || user.coin_balance < coinsToSpend) {
        return res.status(400).json({ error: 'Insufficient coins' });
      }

      // Calculate game currency received
      const gameCurrencyReceived = Math.floor(coinsToSpend / game.conversion_rate);

      // Record redemption
      const redemptionId = generateId();
      db.run(
        'INSERT INTO redemptions (id, user_id, game_id, game_name, coins_spent, game_currency_received) VALUES (?, ?, ?, ?, ?, ?)',
        [redemptionId, userId, game.id, game.name, coinsToSpend, gameCurrencyReceived],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to record redemption' });
          }

          // Update user balance
          db.run(
            'UPDATE users SET coin_balance = coin_balance - ? WHERE id = ?',
            [coinsToSpend, userId],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to update balance' });
              }

              // Get updated balance
              db.get('SELECT coin_balance FROM users WHERE id = ?', [userId], (err, user) => {
                res.json({
                  success: true,
                  coins_spent: coinsToSpend,
                  game_currency_received: gameCurrencyReceived,
                  new_balance: user?.coin_balance || 0,
                  game_name: game.name,
                  message: `Redeemed ${gameCurrencyReceived} items in ${game.name}!`
                });
              });
            }
          );
        }
      );
    });
  });
});

// Get user's recent activity
app.get('/api/activity', authenticateToken, (req, res) => {
  const userId = req.user.id || 'demo-user';

  const query = `
    SELECT 'earned' as type, partner, coins_earned as amount, description, completed_at as timestamp
    FROM actions
    WHERE user_id = ?
    UNION ALL
    SELECT 'redeemed' as type, game_name as partner, coins_spent as amount,
           game_name || ' - ' || game_currency_received || ' items' as description, redeemed_at as timestamp
    FROM redemptions
    WHERE user_id = ?
    ORDER BY timestamp DESC
    LIMIT 10
  `;

  db.all(query, [userId, userId], (err, activities) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(activities || []);
  });
});

// Claim daily streak bonus
app.post('/api/streak/claim', authenticateToken, (req, res) => {
  const userId = req.user.id || 'demo-user';
  const streakBonus = 120; // Daily streak bonus coins

  db.run(
    'UPDATE users SET coin_balance = coin_balance + ?, streak_days = streak_days + 1 WHERE id = ?',
    [streakBonus, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to claim streak bonus' });
      }

      db.get('SELECT coin_balance, streak_days FROM users WHERE id = ?', [userId], (err, user) => {
        res.json({
          success: true,
          coins_earned: streakBonus,
          new_balance: user?.coin_balance || streakBonus,
          streak_days: user?.streak_days || 1,
          message: `Daily streak bonus: +${streakBonus} coins!`
        });
      });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Play'd backend server running on http://localhost:${PORT}`);
  console.log('📊 SQLite database initialized with sample data');
  console.log('🎮 Ready to transform gaming from extraction to empowerment!');
});