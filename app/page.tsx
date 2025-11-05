'use client';

import { useState, useEffect } from 'react';
import ProgressBar from '@/components/ProgressBar';
import TeamMemberTotals from '@/components/TeamMemberTotals';
import DailyTracking from '@/components/DailyTracking';
import AddUserForm from '@/components/AddUserForm';
import AddPushupForm from '@/components/AddPushupForm';
import DarkModeToggle from '@/components/DarkModeToggle';

interface User {
  id: string;
  name: string;
  created_at: Date;
}

interface DailyPushupUser {
  user_id: string;
  user_name: string;
  count: number;
}

interface DailyPushup {
  date: string;
  total: number;
  users: DailyPushupUser[];
}

interface Stats {
  userStats: Array<{ user: User; total: number }>;
  total: number;
  dailyPushups: DailyPushup[];
  goal: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
            <DarkModeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            November Pushup Challenge
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your team's progress toward 10,000 pushups
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <ProgressBar
            current={stats?.total || 0}
            goal={stats?.goal || 10000}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Team Members
            </h2>
            <AddUserForm onUserAdded={fetchStats} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Log Pushups
            </h2>
            <AddPushupForm onPushupAdded={fetchStats} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Daily Tracking
            </h2>
            {stats?.dailyPushups ? (
              <DailyTracking dailyPushups={stats.dailyPushups} />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Team Member Totals
            </h2>
            {stats?.userStats ? (
              <TeamMemberTotals userStats={stats.userStats} />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
