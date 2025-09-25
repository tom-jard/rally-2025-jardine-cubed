
import React, { useState, useEffect } from 'react';
import { GameReward } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import PlayerHeader from '@/components/PlayerHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import AppIcon from '@/components/AppIcon';

function RewardCard({ reward, onRedeem, userDarumas }) {
  const canAfford = userDarumas >= reward.cost;

  return (
    <motion.div
      className="glass-card rounded-2xl p-4 flex flex-col items-center text-center shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppIcon iconUrl={reward.iconUrl} appName={reward.gameName} size={96} className="mb-4" />
      <h3 className="font-bold text-lg">{reward.gameName}</h3>
      <p className="text-sm text-gray-300 mt-1">{reward.description}</p>
      <p className="text-sm text-gray-400 mt-1">Cost: {reward.cost} darumas</p>
      <Button 
        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500"
        onClick={() => onRedeem(reward)}
        disabled={!canAfford}
      >
        Redeem
      </Button>
    </motion.div>
  );
}

export default function GamesPage() {
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedRewards, currentUser] = await Promise.all([
        GameReward.list('-created_date', 4),
        User.me().catch(() => null)
      ]);
      setRewards(fetchedRewards);
      setUser(currentUser || { full_name: 'Demo Player', darumas: 8880, streak: 7 });
    } catch (error) {
      console.error("Error loading data:", error);
      setUser({ full_name: 'Demo Player', darumas: 8880, streak: 7 });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    if (!user) return;
    
    const newDarumaTotal = user.darumas - reward.cost;

    if (newDarumaTotal < 0) {
      alert("You don't have enough darumas for this reward!");
      return;
    }
    
    try {
      // Update user darumas
      if (user.id) {
        await User.updateMyUserData({ darumas: newDarumaTotal });
      }
      
      // Update local state immediately
      setUser({ ...user, darumas: newDarumaTotal });
      
      alert(`Successfully redeemed ${reward.description} for ${reward.gameName}! New balance: ${newDarumaTotal} darumas`);
      
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("There was an error processing your redemption. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PlayerHeader />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Redeem Darumas</h1>
        <p className="text-purple-300 mt-2">Spend your hard-earned darumas on in-game rewards.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {rewards.map(reward => (
            <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeem} userDarumas={user?.darumas || 0} />
          ))}
        </div>
      )}
    </div>
  );
}
