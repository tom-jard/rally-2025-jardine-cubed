import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ExternalLink, Loader2, Shield } from 'lucide-react';
import { createLinkToken } from '@/api/functions';
import { exchangePublicToken } from '@/api/functions';
import { getAccountData } from '@/api/functions';
import { useUser } from '@/contexts/UserContext';

export default function FirstPlatypusBankIntegration({ task, onComplete }) {
  const { updateUserDarumas } = useUser();
  const [step, setStep] = useState('connect');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Load Plaid Link script for realistic demo
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    script.onload = () => {
      console.log('Plaid Link script loaded successfully');
    };
    script.onerror = () => {
      console.log('Failed to load Plaid Link script, will use fallback');
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Script might already be removed
      }
    };
  }, []);

  const handleConnect = async () => {
    console.log('🏦 Connect button clicked!');
    setIsLoading(true);
    setLoadingMessage('Creating secure connection...');
    
    try {
      console.log('📞 Creating Plaid Link token with your credentials...');
      const response = await createLinkToken();
      console.log('✅ Link token created:', response.data.link_token);
      setLinkToken(response.data.link_token);
      
      // Now we can use real Plaid Link with the backend!
      if (window.Plaid && typeof window.Plaid.create === 'function') {
        console.log('🔗 Initializing real Plaid Link...');
        setLoadingMessage('Opening Plaid Link...');
        
        const handler = window.Plaid.create({
          token: response.data.link_token,
          onSuccess: async (public_token, metadata) => {
            console.log('🎉 Plaid Link Success!', {
              institution: metadata.institution,
              accounts: metadata.accounts
            });
            
            try {
              setLoadingMessage('Processing your connection...');
              
              // Exchange public token for access token via backend
              const exchangeResponse = await exchangePublicToken({ public_token });
              const newAccessToken = exchangeResponse.data.access_token;
              setAccessToken(newAccessToken);
              
              setLoadingMessage('Retrieving your account data...');
              
              // Get account data via backend
              const accountResponse = await getAccountData(newAccessToken);
              console.log('✅ Real account data retrieved!');
              console.log('🏦 Connected accounts:', accountResponse.data.accounts.length);
              
              setAccountData(accountResponse.data);
              setStep('verify');
              
            } catch (error) {
              console.error('❌ Error processing Plaid connection:', error);
              alert('Error processing your account data. Please try again.');
            } finally {
              setIsLoading(false);
              setLoadingMessage('');
            }
          },
          onExit: (err, metadata) => {
            console.log('🚪 Plaid Link exited', { error: err, metadata });
            setIsLoading(false);
            setLoadingMessage('');
            
            if (err) {
              console.error('Plaid Link error:', err);
            }
          },
          env: 'sandbox',
          product: ['transactions', 'identity'],
          clientName: 'First Platypus Bank',
          countryCodes: ['US'],
        });
        
        // Open Plaid Link
        console.log('🚀 Opening Plaid Link interface...');
        handler.open();
        
      } else {
        console.log('⚠️ Plaid Link not loaded, please refresh the page');
        alert('Plaid Link failed to load. Please refresh the page and try again.');
        setIsLoading(false);
        setLoadingMessage('');
      }
      
    } catch (error) {
      console.error('❌ Error in Plaid integration:', error);
      alert('Error connecting to your bank account. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    // Always complete successfully since they connected their account
    updateUserDarumas(200); // Give 200 darumas for connecting
    onComplete(task);
    setStep('complete');
  };

  if (step === 'complete') {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Bank Connected!</h3>
          <p className="text-gray-300">You earned 200 darumas for connecting your First Platypus Bank account!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">🦫</span>
          </div>
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'connect' && (
          <div className="space-y-4">
            <p className="text-gray-300">{task.description}</p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-300">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Bank-level security via Plaid</span>
              </div>
            </div>
            <Button 
              onClick={handleConnect}
              disabled={isLoading} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingMessage || 'Connecting...'}
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  🏦 Connect First Platypus Bank
                </>
              )}
            </Button>
          </div>
        )}
        
        {step === 'verify' && accountData && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Successfully connected to First Platypus Bank!</span>
              </div>
            </div>

            {/* Account recommendations with claimable daruma buttons */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 text-center mb-4">🎯 Recommended Actions for More Darumas</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    window.open('https://www.firstbank.com/', '_blank');
                    updateUserDarumas(200);
                    alert('Opened High-Yield Savings Account! +200 darumas earned!');
                  }}
                  className="w-full bg-black/20 hover:bg-black/30 text-white font-medium py-2 rounded-lg flex items-center justify-between"
                >
                  <span>🏦 Open High-Yield Savings</span>
                  <span className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-semibold">Claim 200 Darumas</span>
                </Button>
                <Button 
                  onClick={() => {
                    window.open('https://www.firstbank.com/', '_blank');
                    updateUserDarumas(300);
                    alert('Opened Platypus Credit Card! +300 darumas earned!');
                  }}
                  className="w-full bg-black/20 hover:bg-black/30 text-white font-medium py-2 rounded-lg flex items-center justify-between"
                >
                  <span>💳 Open Platypus Credit Card</span>
                  <span className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-semibold">Claim 300 Darumas</span>
                </Button>
                <Button 
                  onClick={() => {
                    window.open('https://www.firstbank.com/', '_blank');
                    updateUserDarumas(400);
                    alert('Opened Investment Account! +400 darumas earned!');
                  }}
                  className="w-full bg-black/20 hover:bg-black/30 text-white font-medium py-2 rounded-lg flex items-center justify-between"
                >
                  <span>📈 Open Investment Account</span>
                  <span className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-semibold">Claim 400 Darumas</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}