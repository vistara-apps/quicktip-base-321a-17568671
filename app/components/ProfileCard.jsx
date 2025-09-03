    'use client';

    export default function ProfileCard({ address }) {
      return (
        <div className="bg-surface shadow-card rounded-lg p-md text-center">
          <h2 className="text-display mb-sm">Tip Creator</h2>
          <p className="text-body break-all">{address}</p>
        </div>
      );
    }
  