'use client';

interface ProgressBarProps {
  current: number;
  goal: number;
}

export default function ProgressBar({ current, goal }: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Monthly Goal</h2>
        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {current.toLocaleString()} / {goal.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="text-white text-xs font-semibold">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {remaining > 0 ? (
          <span>{remaining.toLocaleString()} pushups remaining</span>
        ) : (
          <span className="text-green-600 dark:text-green-500 font-semibold">Goal achieved! 🎉</span>
        )}
      </div>
    </div>
  );
}

