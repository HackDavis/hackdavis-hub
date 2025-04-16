import styles from './AssigningJudges.module.scss'
import sleeping_cow from 'public/hackers/hero/sleeping_cow.svg'
import radio from 'public/hackers/hero/radio.svg'
import Image from 'next/image'

export default function AssigningJudges(){
    return(
        <div className={styles.container}>
            
            <div className={styles.text_container}>
                <p>PLEASE SIT TIGHT FOR JUDGING INFORMATION...</p>
                <br />
                <p>Hi hacker, we’re assigning you your judges. Sit tight, practice pitching your project, and submit your vote for <b>Hackers Choice Award!</b></p>
            </div>
            <Image src={radio} alt='radio' className={styles.radio_img}/>
            <Image src={sleeping_cow} alt='sleeping cow' className={styles.sleeping_cow_img}/>
        </div>
    );
}