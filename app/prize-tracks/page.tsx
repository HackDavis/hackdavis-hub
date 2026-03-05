import React from 'react';
import { prizeTracks } from '../../data/prizeTracks';

export default function PrizeTracksPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Prize Tracks</h1>
      <ul className="space-y-6">
        {prizeTracks.map((track) => (
          <li key={track.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-2xl font-semibold">{track.title}</h2>
            <p className="text-gray-700">{track.description}</p>
            <p className="text-gray-900 font-medium mt-2">Prize: {track.prize}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
