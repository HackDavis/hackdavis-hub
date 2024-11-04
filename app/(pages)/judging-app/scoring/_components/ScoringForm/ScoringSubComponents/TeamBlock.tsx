import TeamInt from '@typeDefs/teams';
import styles from './TeamBlock.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import backArrow from '/public/judges/hub/back-arrow.svg';

const RightArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="19"
      viewBox="0 0 10 19"
      fill="none"
    >
      <path
        d="M9.70454 8.78954C9.79816 8.88245 9.87247 8.99299 9.92318 9.11478C9.97389 9.23657 10 9.36721 10 9.49915C10 9.63109 9.97389 9.76172 9.92318 9.88351C9.87247 10.0053 9.79816 10.1158 9.70454 10.2088L1.71381 18.2044C1.62096 18.298 1.51048 18.3724 1.38876 18.4231C1.26705 18.4739 1.13649 18.5 1.00463 18.5C0.872774 18.5 0.74222 18.4739 0.620502 18.4231C0.498784 18.3724 0.388311 18.298 0.295456 18.2044C0.201836 18.1115 0.127528 18.0009 0.0768181 17.8791C0.0261082 17.7573 0 17.6267 0 17.4948C0 17.3628 0.0261082 17.2322 0.0768181 17.1104C0.127528 16.9886 0.201836 16.8781 0.295456 16.7851L7.587 9.49915L0.295456 2.21315C0.10737 2.02495 0.00170462 1.7697 0.00170462 1.50354C0.00170463 1.23738 0.10737 0.98213 0.295456 0.79393C0.483541 0.60573 0.73864 0.5 1.00463 0.5C1.27063 0.5 1.52573 0.60573 1.71381 0.79393L9.70454 8.78954Z"
        fill="white"
      />
    </svg>
  );
};

const NoteBook = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M9 3.6C9 3.75913 8.93679 3.91174 8.82426 4.02426C8.71174 4.13679 8.55913 4.2 8.4 4.2H4.8C4.64087 4.2 4.48826 4.13679 4.37574 4.02426C4.26321 3.91174 4.2 3.75913 4.2 3.6C4.2 3.44087 4.26321 3.28826 4.37574 3.17574C4.48826 3.06321 4.64087 3 4.8 3H8.4C8.55913 3 8.71174 3.06321 8.82426 3.17574C8.93679 3.28826 9 3.44087 9 3.6ZM8.4 5.4H4.8C4.64087 5.4 4.48826 5.46321 4.37574 5.57574C4.26321 5.68826 4.2 5.84087 4.2 6C4.2 6.15913 4.26321 6.31174 4.37574 6.42426C4.48826 6.53679 4.64087 6.6 4.8 6.6H8.4C8.55913 6.6 8.71174 6.53679 8.82426 6.42426C8.93679 6.31174 9 6.15913 9 6C9 5.84087 8.93679 5.68826 8.82426 5.57574C8.71174 5.46321 8.55913 5.4 8.4 5.4ZM6.6 7.8H4.8C4.64087 7.8 4.48826 7.86321 4.37574 7.97574C4.26321 8.08826 4.2 8.24087 4.2 8.4C4.2 8.55913 4.26321 8.71174 4.37574 8.82426C4.48826 8.93679 4.64087 9 4.8 9H6.6C6.75913 9 6.91174 8.93679 7.02426 8.82426C7.13679 8.71174 7.2 8.55913 7.2 8.4C7.2 8.24087 7.13679 8.08826 7.02426 7.97574C6.91174 7.86321 6.75913 7.8 6.6 7.8ZM12 1.8V10.2C12 10.6774 11.8104 11.1352 11.4728 11.4728C11.1352 11.8104 10.6774 12 10.2 12H3C2.52261 12 2.06477 11.8104 1.72721 11.4728C1.38964 11.1352 1.2 10.6774 1.2 10.2V9.6H0.6C0.44087 9.6 0.288258 9.53679 0.175736 9.42426C0.0632141 9.31174 0 9.15913 0 9C0 8.84087 0.0632141 8.68826 0.175736 8.57574C0.288258 8.46321 0.44087 8.4 0.6 8.4H1.2V3.6H0.6C0.44087 3.6 0.288258 3.53679 0.175736 3.42426C0.0632141 3.31174 0 3.15913 0 3C0 2.84087 0.0632141 2.68826 0.175736 2.57574C0.288258 2.46321 0.44087 2.4 0.6 2.4H1.2V1.8C1.2 1.32261 1.38964 0.864773 1.72721 0.527208C2.06477 0.189642 2.52261 0 3 0H10.2C10.6774 0 11.1352 0.189642 11.4728 0.527208C11.8104 0.864773 12 1.32261 12 1.8ZM10.8 1.8C10.8 1.64087 10.7368 1.48826 10.6243 1.37574C10.5117 1.26321 10.3591 1.2 10.2 1.2H3C2.84087 1.2 2.68826 1.26321 2.57574 1.37574C2.46321 1.48826 2.4 1.64087 2.4 1.8V3V9V10.2C2.4 10.3591 2.46321 10.5117 2.57574 10.6243C2.68826 10.7368 2.84087 10.8 3 10.8H10.2C10.3591 10.8 10.5117 10.7368 10.6243 10.6243C10.7368 10.5117 10.8 10.3591 10.8 10.2V1.8Z"
        fill="#222221"
      />
    </svg>
  );
};

const figmaLink =
  'https://www.figma.com/proto/9frZI5Kc9f2c8o4ZIZG8fX/Judging-Table-Map?page-id=0:1&type=design&node-id=1-4&viewport=134,164,0.69&t=Jfp4HXeR7nRs3B6R-1&scaling=min-zoom&mode=design';

export default function TeamBlock({ team }: { team: TeamInt }) {
  /* retrieve these from backend */
  return (
    <div className={styles.teamBlock}>
      <div className={styles.topText}>
        <div>
          <Link href="/judges">
            <Image
              src={backArrow}
              alt="back arrow"
              width={50}
              style={{ marginTop: '8px' }}
            />
          </Link>
          <h2 className={styles.teamTable}>Table {team.number}</h2>
        </div>
        <Link href={figmaLink}>
          <div className={styles.mapContent}>
            <h3 className={styles.mapText}>Find on Map</h3>
            <RightArrow />
          </div>
        </Link>
      </div>
      <div className={styles.back_section}>
        <h1 className={styles.teamName}>{team.name}</h1>
      </div>
      <div className={styles.guideContent}>
        <p className={styles.guideText}>
          Please refer back to our judging guide for each track. Tracks are on a
          scale from 1-10.
        </p>
        <Link
          href="https://hackdavis.notion.site/HackDavis-2024-Judging-Guide-2efbd41777fa4d10967d4a035dc41bbf"
          target="_blank"
        >
          <div className={styles.guideButton}>
            <NoteBook />
            <p className={styles.guideButtonText}>Judging Guide</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
