import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// Initialize Plaid client
const plaidConfiguration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '68d44d11d58efa00251413e1',
      'PLAID-SECRET': process.env.PLAID_SECRET || '047a640b4e33dc44257278f7f9a718',
    },
  },
});

const plaidClient = new PlaidApi(plaidConfiguration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
