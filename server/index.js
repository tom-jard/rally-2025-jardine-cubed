const express = require('express');
const cors = require('cors');
const { PlaidApi, Configuration, PlaidEnvironments } = require('plaid');

// Plaid configuration
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '68d44d11d58efa00251413e1',
      'PLAID-SECRET': '047a640b4e33dc44257278f7f9a718',
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data
const mockUser = {
  id: 'user_1',
  full_name: 'Sean Hise',
  email: 'sean@playd.com',
  total_rewards_earned: 8880,
  darumas: 8880
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Play\'d API is running!'
  });
});

// User endpoints
app.get('/api/users/:userId', (req, res) => {
  res.json(mockUser);
});

app.get('/api/users', (req, res) => {
  res.json([mockUser]);
});

// Plaid Integration Endpoints
app.post('/api/plaid/create-link-token', async (req, res) => {
  try {
    const { userId = 'user_1' } = req.body;
    
    const linkTokenRequest = {
      user: {
        client_user_id: userId,
      },
      client_name: "Play'd Financial Gaming App",
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(linkTokenRequest);
    
    res.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plaid/exchange-public-token', async (req, res) => {
  try {
    const { public_token } = req.body;
    
    if (!public_token) {
      return res.status(400).json({ error: 'public_token is required' });
    }
    
    const exchangeRequest = {
      public_token: public_token,
    };

    const response = await plaidClient.itemPublicTokenExchange(exchangeRequest);
    
    res.json({
      access_token: response.data.access_token,
      item_id: response.data.item_id,
      request_id: response.data.request_id
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/plaid/accounts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { access_token } = req.query;
    
    // Return mock data for demo
    const mockAccountData = {
      accounts: [
        {
          account_id: 'acc_demo_checking',
          name: 'First Platypus Checking',
          type: 'depository',
          subtype: 'checking',
          balances: {
            available: 2500.75,
            current: 2500.75,
            iso_currency_code: 'USD'
          }
        },
        {
          account_id: 'acc_demo_savings',
          name: 'First Platypus Savings',
          type: 'depository',
          subtype: 'savings',
          balances: {
            available: 12450.25,
            current: 12450.25,
            iso_currency_code: 'USD'
          }
        }
      ],
      totalBalance: 14951.00,
      hasDirectDeposit: Math.random() > 0.3,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(mockAccountData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Play'd API Server running on port ${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
