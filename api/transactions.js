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
}
