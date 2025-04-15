import styles from "./SubmitProject.module.scss";
import Image from "next/image";
// import StarterKitSlide from '../SubmissionInfo';
// import Animals from 'public/hackers/project-info/submissionProcess.svg';
// import Step5Overlay from 'public/hackers/project-info/Step5Overlay.svg';
// import Blank from 'public/hackers/project-info/Step6.svg';
import VinylPlayer from "./VinylPlayer";
// import VinylPlayer from './VinylPlayer';
import submitProject from "public/hackers/project-info/submitProject.png";

export default function SubmitProject() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Child */}
        <div className={`${styles.child} ${styles.leftchild}`}>
          <div className={styles.imageWrapper}>
            <Image
              src={submitProject}
              alt="Primary Step 1"
              className={styles.primaryImage}
            />
            <p className={styles.text}>Submit Project</p>
          </div>
        </div>

        {/* Right Child */}
        <div className={`${styles.child} ${styles.rightchild}`}>
          <VinylPlayer />
        </div>
      </div>
    </div>

    // <div className={styles.container}>
    //   <p className={styles.text}>
    //     Fill out respective information - project overview, details, etc
    //   </p>

    //   <div className="content">
    //     <div className="child">
    //       <div className={styles.imageWrapper}>
    //         <Image
    //           src={Blank}
    //           alt="Primary Step 1"
    //           fill
    //           style={{ objectFit: 'contain' }}
    //           className={styles.primaryImage}
    //         />
    //       </div>
    //     </div>

    //     <div className="child">
    //       {/* <div className="vinylplayer">
    //       <Image
    //           src={Vinyl} // primary image
    //           alt="Animals on a beach playing instruments."
    //           className={styles.image}
    //         />
    //       </div> */}
    //       <VinylPlayer />
    //     </div>
    //   </div>
    // </div>
  );
}
