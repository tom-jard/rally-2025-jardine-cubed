import apiClient from './apiClient';

// Plaid configuration
const PLAID_CONFIG = {
  client_id: '68d44d11d58efa00251413e1',
  secret: '047a640b4e33dc44257278f7f9a718',
  env: 'sandbox', // sandbox, development, or production
  products: ['transactions', 'accounts', 'identity'],
  country_codes: ['US'],
};

// Real Plaid integration functions using backend server
export async function createLinkToken() {
  try {
    console.log('🔗 Creating Plaid Link token via backend...');
    
    const response = await apiClient.post('/create_link_token', {
      client_user_id: 'sean-hise-' + Date.now(),
    });
    
    console.log('✅ Link token created successfully:', response.data.link_token);
    
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error creating link token:', error.response?.data || error);
    throw error;
  }
}

export async function exchangePublicToken({ public_token }) {
  try {
    console.log('🔄 Exchanging public token via backend...');
    
    const response = await apiClient.post('/exchange_public_token', {
      public_token,
    });
    
    console.log('✅ Public token exchanged successfully');
    
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error exchanging public token:', error.response?.data || error);
    throw error;
  }
}

export async function getAccountData(access_token) {
  try {
    console.log('📊 Fetching account data via backend...');
    
    const response = await apiClient.post('/accounts', {
      access_token,
    });
    
    console.log('✅ Account data retrieved successfully');
    
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error fetching account data:', error.response?.data || error);
    throw error;
  }
}

// Mock investment data functions
export async function getInvestmentData() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    data: {
      totalValue: Math.floor(Math.random() * 100000) + 10000,
      dayChange: (Math.random() - 0.5) * 1000,
      holdings: [
        { symbol: 'AAPL', shares: 10, value: 1750 },
        { symbol: 'GOOGL', shares: 5, value: 1200 },
        { symbol: 'TSLA', shares: 8, value: 2000 },
      ],
    },
    success: true,
  };
}

// Mock notification functions
export async function sendNotification({ title, message, userId }) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Notification sent to ${userId}: ${title} - ${message}`);
  
  return {
    success: true,
    notificationId: `notif-${Date.now()}`,
  };
}

// Mock analytics functions
export async function trackEvent({ eventName, properties, userId }) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log(`Event tracked: ${eventName}`, { properties, userId });
  
  return {
    success: true,
    eventId: `event-${Date.now()}`,
  };
}