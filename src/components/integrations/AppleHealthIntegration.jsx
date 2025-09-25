import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Activity, Loader2, ExternalLink } from 'lucide-react';

export default function AppleHealthIntegration({ task, onComplete }) {
  const [step, setStep] = useState('connected'); // Start as connected
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState({ 
    sleepConsistency: 0, 
    avgSleepHours: 0,
    daysTracked: 7,
    consistentDays: 0
  });

  React.useEffect(() => {
    // Simulate already connected account with sleep data
    const consistentDays = Math.floor(Math.random() * 3) + 5; // 5-7 consistent days
    const avgSleep = 7 + Math.random() * 2; // 7-9 hours average
    
    setHealthData({
      sleepConsistency: Math.round((consistentDays / 7) * 100),
      avgSleepHours: Math.round(avgSleep * 10) / 10,
      daysTracked: 7,
      consistentDays: consistentDays
    });
  }, []);

  const handleVerify = () => {
    // Check if user has consistent sleep (5+ days out of 7)
    const taskCompleted = healthData.consistentDays >= 5;
    
    if (taskCompleted) {
      onComplete(task);
      setStep('complete');
    } else {
      alert(`You need at least 5 days of consistent sleep. You currently have ${healthData.consistentDays} consistent days.`);
    }
  };

  if (step === 'complete') {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Healthy Achievement!</h3>
          <p className="text-gray-300">You earned {task.reward} darumas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'connected' && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Connected to Apple Health</span>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Sleep Consistency (Past 7 Days)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Consistent sleep days:</span>
                  <span className="font-semibold">{healthData.consistentDays}/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Average sleep:</span>
                  <span className="font-semibold">{healthData.avgSleepHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Consistency rate:</span>
                  <span className={`font-semibold ${healthData.sleepConsistency >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {healthData.sleepConsistency}%
                  </span>
                </div>
              </div>
              
              {/* Visual sleep tracker */}
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-2">Daily sleep tracking:</p>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs ${
                        i < healthData.consistentDays
                          ? 'border-green-500 bg-green-500/20 text-green-300'
                          : 'border-gray-500 bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {i < healthData.consistentDays ? '✓' : '○'}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleVerify} className="w-full bg-green-600 hover:bg-green-700">
              Claim {task.reward} Darumas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}