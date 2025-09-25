import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ExternalLink, Loader2, Shield } from 'lucide-react';
import { createLinkToken } from '@/api/functions';
import { exchangePublicToken } from '@/api/functions';
import { getAccountData } from '@/api/functions';

export default function FirstPlatypusBankIntegration({ task, onComplete }) {
  const [step, setStep] = useState('connect');
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    // Load Plaid Link script
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await createLinkToken();
      setLinkToken(response.data.link_token);
      
      // Initialize Plaid Link
      const handler = window.Plaid.create({
        token: response.data.link_token,
        onSuccess: async (public_token, metadata) => {
          console.log('Plaid Link success!', metadata);
          
          // Exchange public token for access token
          await exchangePublicToken({ public_token });
          
          // Get account data
          const accountResponse = await getAccountData();
          setAccountData(accountResponse.data);
          setStep('verify');
        },
        onExit: (err, metadata) => {
          console.log('Plaid Link exited', err, metadata);
          setIsLoading(false);
        },
      });
      
      handler.open();
      
    } catch (error) {
      console.error('Error connecting to Plaid:', error);
      alert('Error connecting to your bank account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    if (!accountData) return;
    
    let taskCompleted = false;
    let failMessage = "Task requirement not met.";

    if (task.title.includes('Direct Deposit')) {
      taskCompleted = accountData.hasDirectDeposit;
      if (!taskCompleted) failMessage = "No direct deposits detected in your account.";
    } else if (task.title.includes('Balance Increase')) {
      taskCompleted = accountData.totalBalance > 1000;
      if (!taskCompleted) failMessage = `Current balance of $${accountData.totalBalance.toLocaleString()} needs to be higher.`;
    }
    
    if (taskCompleted) {
      onComplete(task);
      setStep('complete');
    } else {
      alert(failMessage);
    }
  };

  if (step === 'complete') {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Task Completed!</h3>
          <p className="text-gray-300">You earned {task.reward} darumas from your real SoFi account!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src={task.iconUrl || '/api/placeholder/32/32'} alt="First Platypus Bank" className="w-8 h-8 rounded-md" />
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
                  Loading...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Your Real Account
                </>
              )}
            </Button>
          </div>
        )}
        
        {step === 'verify' && accountData && (
          <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Real Account Summary</h4>
              <p>Total Balance: ${accountData.totalBalance?.toLocaleString() || '0'}</p>
              <p>Direct Deposits: {accountData.hasDirectDeposit ? '✅ Detected' : '❌ None Found'}</p>
              <p>Connected Accounts: {accountData.accounts?.length || 0}</p>
            </div>
            <Button onClick={handleVerify} className="w-full bg-green-600 hover:bg-green-700">
              Verify & Claim {task.reward} Darumas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}