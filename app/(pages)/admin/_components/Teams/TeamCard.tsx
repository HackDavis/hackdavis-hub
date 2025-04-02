'use client';

import Team from '@typeDefs/team';
import { useState } from 'react';
import styles from './TeamCard.module.scss';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <span className={styles.title}>
        Team {team.teamNumber}: {team.name}
      </span>
      <p>_id: {team._id}</p>
      <p>Table Number: {team.tableNumber}</p>
      <p>Tracks: {JSON.stringify(team.tracks)}</p>
      <p>Active: {JSON.stringify(team.active)}</p>
    </div>
  );
}
