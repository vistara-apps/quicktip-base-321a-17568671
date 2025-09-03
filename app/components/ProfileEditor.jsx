'use client';

import { useState } from 'react';

export default function ProfileEditor({ userData, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [farcasterId, setFarcasterId] = useState(userData?.farcasterId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await onUpdate({ farcasterId });
      
      if (result) {
        setSuccess(true);
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface shadow-card rounded-lg p-md">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-body font-bold">Profile Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary text-sm hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label className="block text-sm text-gray-400 mb-sm">
              Wallet Address
            </label>
            <input
              type="text"
              value={userData?.baseWalletAddress}
              disabled
              className="w-full p-sm border rounded-md text-body bg-transparent text-gray-400 border-gray-700"
            />
          </div>

          <div className="mb-md">
            <label className="block text-sm text-gray-400 mb-sm">
              Farcaster ID (optional)
            </label>
            <input
              type="text"
              value={farcasterId}
              onChange={(e) => setFarcasterId(e.target.value)}
              placeholder="Enter your Farcaster ID"
              className="w-full p-sm border rounded-md text-body bg-transparent text-white border-gray-700"
            />
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-500 p-sm rounded-md mb-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500 bg-opacity-20 text-green-500 p-sm rounded-md mb-md">
              <p className="text-sm">Profile updated successfully!</p>
            </div>
          )}

          <div className="flex justify-end space-x-sm">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-md py-sm border border-gray-700 rounded-md text-gray-400 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-md py-sm bg-primary text-white rounded-md hover:bg-opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-md">
            <p className="text-sm text-gray-400">Wallet Address:</p>
            <p className="text-body break-all">{userData?.baseWalletAddress}</p>
          </div>

          <div className="mb-md">
            <p className="text-sm text-gray-400">Farcaster ID:</p>
            <p className="text-body">
              {userData?.farcasterId || 'Not set'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Joined:</p>
            <p className="text-body">
              {userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : 'Unknown'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

