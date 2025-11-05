'use client';

import { useState } from 'react';

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

interface DailyTrackingProps {
  dailyPushups: DailyPushup[];
}

export default function DailyTracking({ dailyPushups }: DailyTrackingProps) {
  if (dailyPushups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No pushups logged yet for this month.
      </div>
    );
  }

  // Show all days, but limit display to prevent overflow
  const maxTotal = Math.max(...dailyPushups.map(d => d.total), 1);

  const formatDate = (dateString: string) => {
    try {
      // Handle different date formats that might come from the database
      let date: Date;
      
      // If it's already in YYYY-MM-DD format, parse it directly
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        // Try parsing as-is
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return dateString; // Return the original string if parsing fails
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);

      if (dateOnly.getTime() === today.getTime()) {
        return 'Today';
      } else if (dateOnly.getTime() === yesterday.getTime()) {
        return 'Yesterday';
      } else {
        return dateOnly.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString; // Fallback to original string
    }
  };

  // Generate colors for each user
  const colors = [
    'bg-blue-500 dark:bg-blue-600',
    'bg-green-500 dark:bg-green-600',
    'bg-purple-500 dark:bg-purple-600',
    'bg-orange-500 dark:bg-orange-600',
    'bg-pink-500 dark:bg-pink-600',
    'bg-yellow-500 dark:bg-yellow-600',
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-red-500 dark:bg-red-600',
  ];

  const getUserColor = (index: number) => colors[index % colors.length];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        November 2024
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2 pt-12 pb-12 overflow-x-visible">
        {dailyPushups.map(({ date, total, users }, index) => (
          <DailyPushupBar
            key={date}
            date={date}
            total={total}
            users={users}
            formatDate={formatDate}
            getUserColor={getUserColor}
            isFirst={index === 0}
            isLast={index === dailyPushups.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function DailyPushupBar({
  date,
  total,
  users,
  formatDate,
  getUserColor,
  isFirst,
  isLast,
}: {
  date: string;
  total: number;
  users: DailyPushupUser[];
  formatDate: (date: string) => string;
  getUserColor: (index: number) => string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  // Position tooltip above for middle items, below for first item
  const tooltipAbove = !isFirst;

  return (
    <div className="space-y-1" style={{ paddingTop: isFirst ? '2rem' : '1rem', paddingBottom: isLast ? '2rem' : '1rem' }}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {formatDate(date)}
        </span>
        <span className="text-gray-900 dark:text-gray-100 font-bold">
          {total.toLocaleString()} pushups
        </span>
      </div>
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div className="flex h-3 relative">
          {users.map((user, index) => {
            const width = total > 0 ? (user.count / total) * 100 : 0;
            const isHovered = hoveredUser === user.user_id;
            
            return (
              <div
                key={user.user_id}
                className={`${getUserColor(index)} h-3 transition-all duration-200 cursor-pointer relative ${
                  isHovered ? 'opacity-90 ring-2 ring-gray-400 dark:ring-gray-500 z-20' : 'opacity-100'
                }`}
                style={{ width: `${width}%` }}
                onMouseEnter={() => setHoveredUser(user.user_id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                {isHovered && (
                  <div className={`absolute ${tooltipAbove ? 'bottom-full mb-3' : 'top-full mt-3'} left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none min-w-max`}>
                    <span className="font-semibold">{user.user_name}:</span> {user.count.toLocaleString()} pushups
                    <div className={`absolute ${tooltipAbove ? 'top-full' : 'bottom-full'} left-1/2 transform -translate-x-1/2 ${tooltipAbove ? '-mt-1' : '-mb-1'}`}>
                      <div className={`border-4 border-transparent ${tooltipAbove ? 'border-t-gray-900 dark:border-t-gray-800' : 'border-b-gray-900 dark:border-b-gray-800'}`}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

