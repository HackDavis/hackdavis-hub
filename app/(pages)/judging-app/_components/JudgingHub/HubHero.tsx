import User from '@typeDefs/user';
import styles from './HubHero.module.scss';
import Image from 'next/image';
import judgeHeroes from '/public/judges/hub/judgingheroes.svg';

export default function HubHero({
  loading,
}: {
  user: User;
  loading: boolean;
  members: string[];
}) {
  if (loading) {
    return 'loading...';
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcome_text}>
        <div className={styles.name_container}>
          <h1>Welcome!</h1>
          <p>
            We appreciate you for helping us judge one of California's biggest
            hackathons!
          </p>
        </div>
      </div>
      <div className={styles.judgecontainer}>
        <div className={styles.judgingheroes}>
          <Image
            src={judgeHeroes}
            alt="Judging Animals"
            className={styles.bottom_blurb}
          />
        </div>
        <div className={styles.blurb}>
          {/* <p className={styles.intro_text}>You're paired with...</p>
          {members.map((member: string, index: number) => (
            <p key={index} className={styles.name}>
              {member}
            </p>
          ))} */}
        </div>
      </div>
    </div>
  );
}
