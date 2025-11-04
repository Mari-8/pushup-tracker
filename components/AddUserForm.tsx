'use client';

import { useState } from 'react';

interface AddUserFormProps {
  onUserAdded: () => void;
}

export default function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 'missing_connection_string') {
          alert('Database connection missing!\n\nPlease create a .env.local file with your Vercel Postgres connection strings.\n\nSee SETUP.md for detailed instructions.');
        } else {
          throw new Error(errorData.error || 'Failed to add user');
        }
        return;
      }

      setName('');
      onUserAdded();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Add Team Member
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}

