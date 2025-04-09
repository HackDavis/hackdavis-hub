import styles from './IndexHeroContent.module.scss'; //using styling from other file....

export default function Announcement({time, title, description, isNew}){
    return(
    <div className={styles.announcement}>
        <div className={styles.time_and_icon}>
          <p style={{color:"#848484"}}>{time}</p>
          
          {isNew && <div className={styles.circle} />}
        </div>
        <h6 style={{fontWeight:"500"}}>{title}</h6>
        <p>{description}</p>
      </div>
      );
}