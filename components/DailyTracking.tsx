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

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        November 2024
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
        {dailyPushups.map(({ date, total }) => (
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
    </div>
  );
}

