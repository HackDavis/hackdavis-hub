import { useState } from 'react';
import JudgeBannerIndividual from './JudgeBannerIndividual';
import styles from './JudgeBannerIndividual.module.scss';

type Notification = {
  id: number;
  name: string;
  description: string;
};

export default function JudgeBanners() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      name: 'JUDGE BANNER PLEASE',
      description:
        'Since you submitted for an MLH track, you will also be visited by a representative.',
    },
    {
      id: 2,
      name: 'JUDGE BANNER PLEASE',
      description:
        'Since you submitted for an NPO track, you will also be visited by a representative.',
    },
    {
      id: 3,
      name: 'JUDGE BANNER PLEASE',
      description:
        'You and your team need to be present at your assigned table during judging!',
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
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  );
}
