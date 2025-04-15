import styles from "./TableLocations.module.scss";
import Link from "next/link";
export default function TableLocations() {
  const figmaLink =
    "https://www.figma.com/proto/9frZI5Kc9f2c8o4ZIZG8fX/Judging-Table-Map?page-id=0:1&type=design&node-id=1-4&viewport=134,164,0.69&t=Jfp4HXeR7nRs3B6R-1&scaling=min-zoom&mode=design";

  return (
    <div className={styles.container}>
      <Link href={figmaLink} target="_blank">
        <div className={styles.header}>Click Here for Table Map</div>
      </Link>
    </div>
  );
}
