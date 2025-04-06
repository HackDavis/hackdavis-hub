import styles from './LoginToDevpost.module.scss';
import Image from 'next/image';
import Step1Overlay from 'public/hackers/project-info/Step1Overlay.svg';
import Step1OverlayMobile from 'public/hackers/project-info/Step1OverlayMobile.svg';
import Blank from 'public/hackers/project-info/Step6.svg';

export default function LoginToDevpost() {
  return (
    <div className={styles.stepContent}>
      {/* <Image className={styles.step1} src={Step1} alt="Step 1" /> */}
      <div className={styles.imageWrapper}>
        <Image
          src={Blank}
          alt="Primary Step 1"
          fill
          style={{ objectFit: 'contain' }}
          className={styles.primaryImage}
        />
        <Image
          src={Step1Overlay}
          alt="Overlay"
          fill
          style={{ objectFit: 'contain' }}
          className={styles.overlayImage}
        />
      </div>
      <p>
        When you click on the Devpost link, you should see this page. Click Join
        Hackathon. Log in or sign up for a Devpost account if you don’t have one
        already.
      </p>
      <Image
        src={Step1OverlayMobile}
        alt="Overlay"
        fill
        style={{ objectFit: 'contain' }}
        className={styles.overlayImageMobile}
      />
    </div>
  );
}
