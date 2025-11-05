'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  created_at: Date;
}

interface AddPushupFormProps {
  onPushupAdded: () => void;
}

export default function AddPushupForm({ onPushupAdded }: AddPushupFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [count, setCount] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default date to today on mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        if (data.length > 0 && !selectedUserId) {
          setSelectedUserId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !count || !date || isSubmitting) return;

    const pushupCount = parseInt(count);
    if (isNaN(pushupCount) || pushupCount <= 0) {
      alert('Please enter a valid number');
      return;
    }

    // Validate date
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      alert('Please select a valid date');
      return;
    }

    // Don't allow future dates
    if (selectedDate > new Date()) {
      alert('Cannot log pushups for future dates');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/pushups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: selectedUserId, 
          count: pushupCount,
          date: date
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add pushups');
      }

      setCount('');
      onPushupAdded();
    } catch (error: any) {
      console.error('Error adding pushups:', error);
      alert(error.message || 'Failed to add pushups. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        Add a team member first to log pushups
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Log Pushups
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              id="user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isSubmitting}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Count"
              min="1"
              className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !count || !date}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
          <div>
            <label htmlFor="date" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Date (defaults to today)
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

