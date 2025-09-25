// Plaid Configuration
const PLAID_CONFIG = {
  client_id: '68d44d11d58efa00251413e1',
  secret: '047a640b4e33dc44257278f7f9a718',
  env: 'sandbox', // sandbox, development, or production
  products: ['transactions', 'identity'], // 'accounts' is not a valid product, it's accessed via the accounts endpoint
  country_codes: ['US'],
};

// Server Configuration
const SERVER_CONFIG = {
  port: process.env.PORT || 5000,
  cors_origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  node_env: process.env.NODE_ENV || 'development',
};

module.exports = {
  PLAID_CONFIG,
  SERVER_CONFIG,
};
