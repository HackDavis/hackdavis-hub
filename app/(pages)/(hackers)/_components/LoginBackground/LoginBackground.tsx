'use client';

import Image from 'next/image';
import Logo from 'public/hackers/mvp/HDLogo.svg';
import styles from './LoginBackground.module.scss';
import grassAsset from '@public/hackers/mvp/grass_asset.svg';
import mascots from '@public/hackers/mvp/peeking_around_wall.svg';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mascotsVisibility, setMascotsVisibility] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/register/details') {
      setMascotsVisibility(false);
    } else {
      setMascotsVisibility(true);
    }
  }, [pathname]);

  return (
    <div className={styles.container}>
      <Image src={Logo} alt="hackdavis logo" className={styles.logo} />
      <div className={styles.overlayContent}>{children}</div>
      <div className={styles.grass_asset}>
        <Image
          src={grassAsset}
          alt="grass asset"
          className={styles.grass}
          style={mascotsVisibility ? {} : { position: 'relative' }}
        />
        {mascotsVisibility && (
          <Image src={mascots} alt="mascots" className={styles.mascots} />
        )}
      </div>
    </div>
  );
}
