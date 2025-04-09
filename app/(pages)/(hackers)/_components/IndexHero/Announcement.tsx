import styles from './IndexHeroContent.module.scss'; //using styling from other file....

export default function Announcement(){
    return(
    <div className={styles.announcement}>
        <div className={styles.time_and_icon}>
          <p>10:00 AM</p>
          <div className={styles.circle}/>
        </div>
        <p>Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
      </div>
      );
}