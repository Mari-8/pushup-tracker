'use client';

interface DailyPushup {
  date: string;
  total: number;
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

  // Get the most recent 7 days or all days if less than 7
  const recentDays = dailyPushups.slice(0, 7);
  const maxTotal = Math.max(...recentDays.map(d => d.total), 1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Last 7 Days
      </h3>
      {recentDays.map(({ date, total }) => (
        <div key={date} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {formatDate(date)}
            </span>
            <span className="text-gray-900 dark:text-gray-100 font-bold">
              {total.toLocaleString()} pushups
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(total / maxTotal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

