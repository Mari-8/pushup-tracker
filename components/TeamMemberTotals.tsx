'use client';

interface User {
  id: string;
  name: string;
  created_at: Date;
}

interface TeamMemberTotalsProps {
  userStats: Array<{ user: User; total: number }>;
}

export default function TeamMemberTotals({ userStats }: TeamMemberTotalsProps) {
  if (userStats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No users yet. Add a user to get started!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {userStats.map(({ user, total }) => (
        <div
          key={user.id}
          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user.name}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">pushups</div>
          </div>
        </div>
      ))}
    </div>
  );
}

