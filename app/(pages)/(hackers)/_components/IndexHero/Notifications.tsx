import styles from "./NotificationIndividual.module.scss"; //using styling from other file....
import { useState, useEffect } from "react";
import notif from "@public/hackers/hero/notif.svg";
import Image from "next/image";
import NotificationIndividual from "./NotificationIndividual";
import notif_new from "@public/hackers/hero/notif_new.svg";

export default function Notifications() {
  const [isNew, setIsNew] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setIsNew(false);
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "MLH Track",
      description:
        "Since you submitted for an MLH track, you will also be visited by a representative.",
    },
    {
      id: 2,
      name: "NPO Track",
      description:
        "Since you submitted for an NPO track, you will also be visited by a representative.",
    },
    {
      id: 3,
      name: "Reminder",
      description:
        "You and your team need to be present at your assigned table during judging!",
    },
  ]);

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (notifications.length === 0) {
      setIsOpen(false);
    }
  }, [notifications]);

  return (
    <div>
      <button onClick={handleClick}>
        {!isOpen && (
          <Image src={isNew ? notif_new : notif} alt="notification" />
        )}
      </button>
      {isOpen && (
        <div className={styles.container_position}>
          {notifications.length === 0 ? (
            <Image src={notif} alt="notification" />
          ) : (
            notifications.map((notif) => (
              <NotificationIndividual
                key={notif.id}
                name={notif.name}
                description={notif.description}
                onDismiss={() => dismissNotification(notif.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
