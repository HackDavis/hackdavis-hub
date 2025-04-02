import styles from './Break.module.scss';
import relaxing_cow from '@public/hackers/project-info/relaxing_cow.svg';
import radio from '@public/hackers/project-info/radio.svg';
import Image from 'next/image';

export default function Break() {
  return (
    <div className={styles.container}>
      <div>
        <h3>Hacker’s Choice Award</h3>
        <br />
        <p>
          Once demos end, you will about an hour’s time to visit other teams and
          vote for the <a href="/link">Hacker’s Choice Award</a>. You can also
          look at projects in the gallery on devpost.
        </p>
        <br />
        <p>
          Meanwhile, panels of judges will be choosing the winners from the top
          5 projects shortlisted for each track after demos.
        </p>
        <br />
        <button>Submit Vote</button>
      </div>
      <div className={styles.image_cont}>
        <Image src={radio} alt="radio" className={styles.radio_img} />
        <Image
          src={relaxing_cow}
          alt="relaxing cow"
          className={styles.cow_img}
        />
      </div>
    </div>
  );
}
