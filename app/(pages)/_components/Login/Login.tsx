import styles from './Login.module.scss';
import Image from 'next/image';
// import MusicAnimals from 'public/hackers/mvp/MusicAnimals.svg';
import Clouds from 'public/hackers/mvp/Clouds.svg';
// import BottomGrass from 'public/hackers/mvp/BottomGrass.svg';
import Logo from 'public/hackers/mvp/HDLogo.svg';

export default async function RegistrationLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* put children in here ! */}
      <div className={styles.overlayContent}>{children}</div>

      <div className={styles.scenery}>
        <Image src={Logo} alt="hackdavis logo" className={styles.logo} />
        <Image src={Clouds} alt="clouds" className={styles.clouds} />
        {/* <Image src={BottomGrass} alt="grass" className={styles.grass} /> */}
      </div>
    </div>
  );
}
