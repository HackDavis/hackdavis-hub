import styles from './IndexHeroContent.module.scss'; //using styling from other file....
import { useState } from 'react';
import notif from '@public/hackers/hero/notif.svg';
import Image from 'next/image';
import notif_new from '@public/hackers/hero/notif_new.svg';

export default function Notifications(){
    const [isNew, setIsNew] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
        setIsNew(false); // Optional: mark as "read" on click
    };
    return(
    <div>
        <button onClick={handleClick}>
            {!isOpen && (
                <Image 
                    src={isNew ? notif_new : notif} 
                    alt="notification" 
                />
            )}
        </button>
        {isOpen && (
            <div>
                <p>This is a temporary notification box.</p>
            </div>
        )}
      </div>
    );
}