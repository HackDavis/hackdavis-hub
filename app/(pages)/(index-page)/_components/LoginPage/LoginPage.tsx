import LoginForm from './LoginForm';
import Image from 'next/image';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Image src="/login/hd_logo.svg" alt="hd_logo" height={50} width={50} />
      </div>
      <div className={styles.section}>
        <h3>Welcome Judges!</h3>
        <p>Enter your username and password.</p>
      </div>
      <div className={styles.section}>
        <LoginForm></LoginForm>
      </div>
      {/* <div className={styles.hero}>
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
        <LoginForm></LoginForm>
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
      </div> */}
    </div>
  );
}
