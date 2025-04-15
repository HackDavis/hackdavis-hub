import styles from './Map.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import backArrow from '/public/judges/hub/back-arrow.svg';

import map from 'public/judges/hub/map.png';
export default function Map() {
  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
        }}
      >
        <Link href="/judges">
          <Image
            src={backArrow}
            alt="back arrow"
            width={50}
            style={{ marginTop: '8px' }}
          />
        </Link>
        <h3 className={styles.header}>Go Back</h3>
      </div>

      <Image src={map} alt={'venue map'} className={styles.map} />
    </div>
  );
}
