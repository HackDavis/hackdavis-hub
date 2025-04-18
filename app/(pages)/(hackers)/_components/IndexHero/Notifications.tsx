import styles from './NotificationIndividual.module.scss'; //using styling from other file....
import { useState, useEffect } from 'react';
import notif from '@public/hackers/hero/notif.svg';
import Image from 'next/image';
import NotificationIndividual from './NotificationIndividual';
import notif_new from '@public/hackers/hero/notif_new.svg';

export default function Notifications() {
  const [isNew, setIsNew] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setIsNew(false);
  };

  const [notifications] = useState([
    {
      id: 1,
      name: 'MLH Track',
      description:
        'Since you submitted for an MLH track, you will also be visited by a representative.',
    },
    {
      id: 2,
      name: 'NPO Track',
      description:
        'Since you submitted for an NPO track, you will also be visited by a representative.',
    },
    {
      id: 3,
      name: 'Reminder',
      description:
        'You and your team need to be present at your assigned table during judging!',
    },
    {
      id: 4,
      name: 'Reminder',
      description:
        'You and your team need to be present at your assigned table during judging!',
    },
    {
      id: 5,
      name: 'Reminder',
      description:
        'You and your team need to be present at your assigned table during judging!',
    },
  ]);

  useEffect(() => {
    if (notifications.length === 0) {
      setIsOpen(false);
    }
  }, [notifications]);

  return (
    <div>
      <button onClick={handleClick}>
        <Image src={isNew ? notif_new : notif} alt="notification" />
      </button>
      {isOpen && (
        <>
          <div className={styles.container_position}>
            <button
              className={styles.close_button_mobile}
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12.0008 13.4002L9.10078 16.3002C8.91745 16.4835 8.68411 16.5752 8.40078 16.5752C8.11745 16.5752 7.88411 16.4835 7.70078 16.3002C7.51745 16.1169 7.42578 15.8835 7.42578 15.6002C7.42578 15.3169 7.51745 15.0835 7.70078 14.9002L10.6008 12.0002L7.70078 9.1252C7.51745 8.94186 7.42578 8.70853 7.42578 8.4252C7.42578 8.14186 7.51745 7.90853 7.70078 7.7252C7.88411 7.54186 8.11745 7.4502 8.40078 7.4502C8.68411 7.4502 8.91745 7.54186 9.10078 7.7252L12.0008 10.6252L14.8758 7.7252C15.0591 7.54186 15.2924 7.4502 15.5758 7.4502C15.8591 7.4502 16.0924 7.54186 16.2758 7.7252C16.4758 7.9252 16.5758 8.16286 16.5758 8.4382C16.5758 8.71353 16.4758 8.94253 16.2758 9.1252L13.3758 12.0002L16.2758 14.9002C16.4591 15.0835 16.5508 15.3169 16.5508 15.6002C16.5508 15.8835 16.4591 16.1169 16.2758 16.3002C16.0758 16.5002 15.8384 16.6002 15.5638 16.6002C15.2891 16.6002 15.0598 16.5002 14.8758 16.3002L12.0008 13.4002Z"
                  fill="white"
                />
              </svg>
              <p>CLOSE</p>
            </button>
            {notifications.length === 0 ? (
              <Image src={notif} alt="notification" />
            ) : (
              notifications.map((notif) => (
                <NotificationIndividual
                  key={notif.id}
                  name={notif.name}
                  description={notif.description}
                />
              ))
            )}
            <button className={styles.close_button} onClick={handleClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13 14.8033L9.19672 18.6066C8.95628 18.847 8.65027 18.9672 8.27869 18.9672C7.9071 18.9672 7.60109 18.847 7.36066 18.6066C7.12022 18.3661 7 18.0601 7 17.6885C7 17.3169 7.12022 17.0109 7.36066 16.7705L11.1639 12.9672L7.36066 9.19672C7.12022 8.95628 7 8.65027 7 8.27869C7 7.9071 7.12022 7.60109 7.36066 7.36066C7.60109 7.12022 7.9071 7 8.27869 7C8.65027 7 8.95628 7.12022 9.19672 7.36066L13 11.1639L16.7705 7.36066C17.0109 7.12022 17.3169 7 17.6885 7C18.0601 7 18.3661 7.12022 18.6066 7.36066C18.8689 7.62295 19 7.93464 19 8.29574C19 8.65683 18.8689 8.95716 18.6066 9.19672L14.8033 12.9672L18.6066 16.7705C18.847 17.0109 18.9672 17.3169 18.9672 17.6885C18.9672 18.0601 18.847 18.3661 18.6066 18.6066C18.3443 18.8689 18.033 19 17.6728 19C17.3126 19 17.0118 18.8689 16.7705 18.6066L13 14.8033Z"
                  fill="#005271"
                  fillOpacity="0.7"
                />
              </svg>
              <p>CLOSE</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
