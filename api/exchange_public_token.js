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
    const { public_token } = req.body;
    
    if (!public_token) {
      return res.status(400).json({ error: 'public_token is required' });
    }

    console.log('🔄 Exchanging public token...');
    
    const request = {
      public_token: public_token,
    };

    const response = await plaidClient.itemPublicTokenExchange(request);
    
    console.log('✅ Public token exchanged successfully');
    
    res.json({
      access_token: response.data.access_token,
      item_id: response.data.item_id,
      request_id: response.data.request_id,
    });
  } catch (error) {
    console.error('❌ Error exchanging public token:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to exchange public token',
      details: error.response?.data || error.message,
    });
  }
}
