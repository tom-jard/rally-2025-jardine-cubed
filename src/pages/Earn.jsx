
import React, { useState, useEffect } from 'react';
import { Task } from '@/api/entities';
import { Button } from '@/components/ui/button';
import PlayerHeader from '@/components/PlayerHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
// Simple groupBy implementation to replace lodash
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}
import ActionOfTheDay from '../components/earn/ActionOfTheDay';
import FirstPlatypusBankIntegration from '../components/integrations/FirstPlatypusBankIntegration';
import AppleHealthIntegration from '../components/integrations/AppleHealthIntegration';
import SelfLearningIntegration from '../components/integrations/SelfLearningIntegration';
import AppIcon from '../components/AppIcon';

function TaskItem({ task, onComplete }) {
  const [showIntegration, setShowIntegration] = useState(false);

  // Define a list of apps that require a special integration view
  const integrationApps = ['First Platypus Bank', 'Apple Health', 'Self Learning', 'Fidelity'];

  if (showIntegration) {
    // Render specific integration component based on appName
    if (task.appName === 'First Platypus Bank' || task.appName === 'Fidelity') {
      return <FirstPlatypusBankIntegration task={task} onComplete={onComplete} />;
    }
    if (task.appName === 'Apple Health') {
      return <AppleHealthIntegration task={task} onComplete={onComplete} />;
    }
    if (task.appName === 'Self Learning') {
      return <SelfLearningIntegration task={task} onComplete={onComplete} />;
    }
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
      <div>
        <p className="font-semibold">{task.title}</p>
        <p className="text-xs text-gray-300">{task.description}</p>
      </div>
      <Button 
        onClick={() => {
          console.log('Task button clicked:', task.appName, task.title); // Debug log
          // If the task's appName is in the integrationApps list, show the integration component
          if (integrationApps.includes(task.appName)) {
            console.log('Showing integration for:', task.appName);
            setShowIntegration(true);
          } else {
            console.log('Completing task directly:', task.appName);
            // Otherwise, complete the task directly
            onComplete(task);
          }
        }}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
      >
        + {task.reward}
      </Button>
    </div>
  );
}

function AppCard({ appName, tasks, onComplete }) {
  const firstTask = tasks[0];
  
  return (
    <motion.div
      className="glass-card rounded-2xl p-4 flex flex-col shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <AppIcon 
          iconUrl={firstTask?.iconUrl} 
          appName={appName || 'App'} 
          size={48}
        />
        <h3 className="font-bold text-xl">{appName || 'App'}</h3>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onComplete={onComplete} />
        ))}
      </div>
    </motion.div>
  );
}

export default function EarnPage() {
  const [tasksByApp, setTasksByApp] = useState({});
  const [loading, setLoading] = useState(true);
  const { updateUserDarumas } = useUser();

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        const fetchedTasks = await Task.list('-created_date');
        // Filter out unwanted apps and tasks without a name
        const validTasks = fetchedTasks.filter(task => 
          task.appName && 
          task.appName.trim() !== '' &&
          task.appName !== 'Claude/OpenAI' &&
          task.appName !== 'OpenAI' &&
          !task.appName.includes('Claude/OpenAI')
        );
        
        const grouped = groupBy(validTasks, 'appName');
        
        // Ensure no app shows more than 3 tasks
        const finalTasks = {};
        for (const appName in grouped) {
            finalTasks[appName] = grouped[appName].slice(0, 3);
        }
        
        setTasksByApp(finalTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);
  
  const handleComplete = async (task) => {
    try {
      const newDarumaTotal = await updateUserDarumas(task.reward || 0);
      alert(`Completed "${task.title}" and earned ${task.reward} darumas! New balance: ${newDarumaTotal.toLocaleString()}`);
    } catch (error) {
      console.error("Error completing task:", error);
      alert(`Completed "${task.title}" and earned ${task.reward} darumas! (Demo mode)`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PlayerHeader />
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Earn Darumas</h1>
        <p className="text-purple-300 mt-2">Complete real-world tasks to build habits and earn rewards.</p>
      </div>

      <div className="mb-8">
        <ActionOfTheDay />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 h-48">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(tasksByApp)
            .sort(([appNameA], [appNameB]) => {
              // Sort to put First Platypus Bank first (top left), Self Learning last (bottom right)
              if (appNameA === 'First Platypus Bank') return -1;
              if (appNameB === 'First Platypus Bank') return 1;
              if (appNameA === 'Self Learning') return 1;
              if (appNameB === 'Self Learning') return -1;
              return appNameA.localeCompare(appNameB);
            })
            .map(([appName, tasks]) => (
              <AppCard key={appName} appName={appName} tasks={tasks} onComplete={handleComplete} />
            ))}
        </div>
      )}
    </div>
  );
}
