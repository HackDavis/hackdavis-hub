import { useState } from 'react';
import JudgeBannerIndividual from './JudgeBannerIndividual';
import styles from './JudgeBannerIndividual.module.scss';

type Notification = {
  id: number;
  name: string;
  description: string;
  teams: number;
};

export default function JudgeBanners() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      name: 'Judge Name',
      description: 'There are 2 teams ahead of you for this judge.',
      teams: 2,
    },
    {
      id: 2,
      name: 'Judge Name',
      description: 'There are 3 teams ahead of you for this judge.',
      teams: 3,
    },
    {
      id: 3,
      name: 'Judge Name',
      description: 'There are 6 teams ahead of you for this judge.',
      teams: 6,
    },
  ]);

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className={styles.container_position}>
      {notifications.map((notification) => (
        <JudgeBannerIndividual
          key={notification.id}
          name={notification.name}
          description={notification.description}
          teams={notification.teams}
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  );
}
