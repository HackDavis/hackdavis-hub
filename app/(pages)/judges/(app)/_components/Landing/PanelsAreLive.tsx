'use client';

import styles from './ViewProjects.module.scss';
import { usePanel } from '@hooks/usePanel';
import { useState } from 'react';

export default function PanelsAreLive() {
  const { panel, loading } = usePanel();
  const [showBanner, setShowBanner] = useState(true);

  if (loading || !showBanner) return null;

  return (
    <div className={styles.container}>
      <div className={styles.projects}>
        <h1>{panel ? '👋 Judging is Live!' : '👋 Thank you for judging!'}</h1>
        <p>
          {panel
            ? `You are on the ${panel.track}. Please start making your way to the activities area.`
            : 'You are not assigned a panel for the next judging stage. Feel free to explore other activities :)'}
        </p>
        <button type="button" onClick={() => setShowBanner(false)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
