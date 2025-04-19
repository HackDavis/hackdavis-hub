'use client';

import { useEffect, useState } from 'react';
import JudgeBannerIndividual from './JudgeBannerIndividual';
import { useTeam } from '@pages/_hooks/useTeam';
import Team from '@typeDefs/team';
import styles from './JudgeBannerIndividual.module.scss';

type Notification = {
  icon: string;
  id: number;
  name: string;
  description: string;
  teams: number;
};

export default function JudgeBanners() {
  const [team, setTeam] = useState<Team | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      icon: '/hackers/hero/PeekingCow.svg',
      id: 1,
      name: 'Judge Name',
      description: 'There are 2 teams ahead of you for this judge.',
      teams: 2,
    },
    {
      icon: '/hackers/hero/PeekingBunny.svg',
      id: 2,
      name: 'Judge Name',
      description: 'There are 3 teams ahead of you for this judge.',
      teams: 3,
    },
    {
      icon: '/hackers/hero/PeekingDuck.svg',
      id: 3,
      name: 'Judge Name',
      description: 'There are 6 teams ahead of you for this judge.',
      teams: 6,
    },
  ]);

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const storedTableNumber = localStorage.getItem('tableNumber');
    if (storedTableNumber) {
      const parsedNumber = parseInt(storedTableNumber);
      if (!isNaN(parsedNumber)) {
        setTableNumber(parsedNumber);
      }
    }
  }, []);

  useEffect(() => {
    if (tableNumber) {
    }
  }, [tableNumber]);

  return (
    <div className={styles.container_position}>
      {notifications.map((notification) => (
        <JudgeBannerIndividual
          key={notification.id}
          icon={notification.icon}
          name={notification.name}
          description={notification.description}
          teamNumber={notification.teams}
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  );
}
