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
    console.log('🔗 Creating Plaid Link token...');
    
    const request = {
      user: {
        client_user_id: req.body.client_user_id || 'sean-hise-' + Date.now(),
      },
      client_name: 'First Platypus Bank',
      products: ['transactions', 'identity'],
      country_codes: ['US'],
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
}
