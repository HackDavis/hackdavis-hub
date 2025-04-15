import Link from "next/link";
import styles from "./ViewProjects.module.scss";

export default function ViewMap() {
  return (
    <div className={styles.container}>
      <div className={styles.projects}>
        <h1>‼️ Panel / Track name</h1>
        <p>
          Stage two of judging is now live. Please start making your way to the
          activities area.
        </p>
        <Link href={"judges/map"}>
          <button type="button">View Map</button>
        </Link>
      </div>
    </div>
  );
}
