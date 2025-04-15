import styles from './LoginToDevpost.module.scss';
import Image from 'next/image';
import Step1Overlay from 'public/hackers/project-info/Step1Overlay.svg';
import Step1OverlayMobile from 'public/hackers/project-info/Step1OverlayMobile.svg';
import loginToDevpostImg from 'public/hackers/project-info/loginToDevpost.png';

export default function LoginToDevpost() {
  return (
    <div className={styles.stepContent}>
      <div className={styles.imageWrapper}>
        <div className={styles.primaryImageWrapper}>
          <Image
            src={loginToDevpostImg}
            alt="Primary Step 1"
            fill
            // style={{ objectFit: 'contain' }}
            className={styles.primaryImage}
          />
        </div>
        <Image
          src={Step1Overlay}
          alt="Overlay"
          fill
          style={{ objectFit: 'contain' }}
          className={styles.overlayImage}
        />
      </div>
      <p>
        When you click on the Devpost link, you should see a page like this.
        Click <strong>Join Hackathon</strong>. Log in or sign up for a Devpost
        account if you don't have one already.
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
