const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { PLAID_CONFIG, SERVER_CONFIG } = require('./config');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: SERVER_CONFIG.cors_origin,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Plaid client
const plaidConfiguration = new Configuration({
  basePath: PlaidEnvironments[PLAID_CONFIG.env],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CONFIG.client_id,
      'PLAID-SECRET': PLAID_CONFIG.secret,
    },
  },
});

const plaidClient = new PlaidApi(plaidConfiguration);

// Store access tokens (in production, use a database)
const accessTokens = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    plaid_env: PLAID_CONFIG.env 
  });
});

// Create Link Token endpoint
app.post('/api/create_link_token', async (req, res) => {
  try {
    console.log('🔗 Creating Plaid Link token...');
    
    const request = {
      user: {
        client_user_id: req.body.client_user_id || 'sean-hise-' + Date.now(),
      },
      client_name: 'First Platypus Bank',
      products: PLAID_CONFIG.products,
      country_codes: PLAID_CONFIG.country_codes,
      language: 'en',
    };

    const response = await plaidClient.linkTokenCreate(request);
    
    console.log('✅ Link token created successfully');
    
    res.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      request_id: response.data.request_id,
    });
  } catch (error) {
    console.error('❌ Error creating link token:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to create link token',
      details: error.response?.data || error.message,
    });
  }
});

// Exchange Public Token endpoint
app.post('/api/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    
    if (!public_token) {
      return res.status(400).json({ error: 'public_token is required' });
    }

    console.log('🔄 Exchanging public token...');
    
    const request = {
      public_token: public_token,
    };

    const response = await plaidClient.itemPublicTokenExchange(request);
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Store access token (in production, save to database with user association)
    accessTokens.set(itemId, accessToken);
    
    console.log('✅ Public token exchanged successfully');
    
    res.json({
      access_token: accessToken,
      item_id: itemId,
      request_id: response.data.request_id,
    });
  } catch (error) {
    console.error('❌ Error exchanging public token:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to exchange public token',
      details: error.response?.data || error.message,
    });
  }
});

// Get Accounts endpoint
app.post('/api/accounts', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    if (!access_token) {
      return res.status(400).json({ error: 'access_token is required' });
    }

    console.log('📊 Fetching account data...');
    
    const request = {
      access_token: access_token,
    };

    const response = await plaidClient.accountsGet(request);
    const accounts = response.data.accounts;
    
    // Process accounts to determine what types exist
    const accountTypes = {
      hasCheckingAccount: false,
      hasSavingsAccount: false,
      hasCreditCard: false,
      hasInvestmentAccount: false,
    };
    
    let totalBalance = 0;
    
    accounts.forEach(account => {
      if (account.balances.current) {
        totalBalance += account.balances.current;
      }
      
      switch (account.subtype) {
        case 'checking':
          accountTypes.hasCheckingAccount = true;
          break;
        case 'savings':
          accountTypes.hasSavingsAccount = true;
          break;
        case 'credit card':
          accountTypes.hasCreditCard = true;
          break;
        case 'brokerage':
        case 'ira':
        case '401k':
          accountTypes.hasInvestmentAccount = true;
          break;
      }
    });
    
    console.log('✅ Account data retrieved successfully');
    
    res.json({
      accounts: accounts.map(account => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances.current || 0,
        available: account.balances.available || 0,
      })),
      totalBalance,
      hasDirectDeposit: Math.random() > 0.5, // Mock for demo
      ...accountTypes,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching accounts:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch accounts',
      details: error.response?.data || error.message,
    });
  }
});

// Get Transactions endpoint
app.post('/api/transactions', async (req, res) => {
  try {
    const { access_token, start_date, end_date } = req.body;
    
    if (!access_token) {
      return res.status(400).json({ error: 'access_token is required' });
    }

    console.log('💳 Fetching transaction data...');
    
    const request = {
      access_token: access_token,
      start_date: start_date || '2024-01-01',
      end_date: end_date || new Date().toISOString().split('T')[0],
    };

    const response = await plaidClient.transactionsGet(request);
    const transactions = response.data.transactions;
    
    console.log('✅ Transaction data retrieved successfully');
    
    res.json({
      transactions: transactions.slice(0, 10).map(transaction => ({
        id: transaction.transaction_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        merchant_name: transaction.merchant_name,
        category: transaction.category,
        account_id: transaction.account_id,
      })),
      total_transactions: response.data.total_transactions,
      request_id: response.data.request_id,
    });
  } catch (error) {
    console.error('❌ Error fetching transactions:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      details: error.response?.data || error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /api/health',
      'POST /api/create_link_token',
      'POST /api/exchange_public_token',
      'POST /api/accounts',
      'POST /api/transactions',
    ],
  });
});

// Start server
const PORT = SERVER_CONFIG.port;
app.listen(PORT, () => {
  console.log(`🚀 Playd Backend Server running on port ${PORT}`);
  console.log(`🔗 Frontend URL: ${SERVER_CONFIG.cors_origin}`);
  console.log(`🏦 Plaid Environment: ${PLAID_CONFIG.env}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/create_link_token`);
  console.log(`   POST /api/exchange_public_token`);
  console.log(`   POST /api/accounts`);
  console.log(`   POST /api/transactions`);
});

module.exports = app;
