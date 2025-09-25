import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function PlayerHeader() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-between items-center py-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <header className="flex justify-between items-center py-8 text-white">
      <div>
        <h2 className="text-xl font-semibold">{user?.full_name || 'Sean Hise'}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="glass-card flex items-center gap-2 px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-lg">{user?.darumas?.toLocaleString() || '0'}</span>
        </div>
      </div>
    </header>
  );
}