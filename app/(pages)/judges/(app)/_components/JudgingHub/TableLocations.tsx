import styles from './TableLocations.module.scss';
import Image from 'next/image';
import vinyl from '/public/judges/hub/vinyl.svg';
import bunnyHand from '/public/judges/hub/bunny-hand.svg';
import vinylPlayer from '/public/judges/hub/vinyl-player.svg';
export default function TableLocations() {
  /* const logOutStyle = {
    zIndex: 1,
    borderRadius: '15.497px',
    background: '#9EE7E5',
    boxShadow: '0px 3.874px 61.987px 0px rgba(255, 197, 61, 0.16)',
    color: '#173A52',
    textAlign: 'center',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
    letterSpacing: '0.32px',
    width: '90%',
    height: '43px',
    border: 'none',
    alignSelf: 'center',
    marginTop: '64px',
  };
  const figmaLink =
    'https://www.figma.com/proto/9frZI5Kc9f2c8o4ZIZG8fX/Judging-Table-Map?page-id=0:1&type=design&node-id=1-4&viewport=134,164,0.69&t=Jfp4HXeR7nRs3B6R-1&scaling=min-zoom&mode=design';
 */
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        If you have any questions, please ask a HackDavis director (bright white
        shirt)!
      </div>
      <div className={styles.vinyl_container}>
        <Image src={vinyl} alt="Vinyl" className={styles.vinyl} />
        <Image src={bunnyHand} alt="Bunny hand" className={styles.bunny_hand} />
        <Image
          src={vinylPlayer}
          alt="Vinyl Player"
          className={styles.vinyl_player}
        />
      </div>
    </div>
  );
}
