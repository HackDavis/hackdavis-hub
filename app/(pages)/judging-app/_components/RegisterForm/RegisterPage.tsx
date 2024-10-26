import Image from 'next/image';
import styles from './RegisterPage.module.scss';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Image src="/judges/auth/judge_login_hero.png" alt="" fill />
      </div>
      <div className={styles.form_section}>
        <div className={styles.logo_container}>
          <Image src="/judges/auth/hd-logo.svg" alt="" fill />
        </div>
        <div className={styles.form_intro}>
          <p>Welcome to HackDavis,</p>
          <h1>Judges!</h1>
        </div>
        <RegisterForm />
      </div>
      <div className={styles.computer_container}>
        <Image
          src="/judges/auth/computer.png"
          alt=""
          height={1600}
          width={1600}
          quality={100}
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}
