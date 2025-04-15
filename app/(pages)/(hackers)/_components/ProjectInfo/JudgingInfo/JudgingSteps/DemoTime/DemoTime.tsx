"use client";

import {
  TimelineTile1,
  TimelineTile2,
  JudgesTile1,
  JudgesTile2,
  PostDemoTile1,
} from "./DemoTimeComponents";
import styles from "./DemoTime.module.scss";

interface Section {
  title: string;
  background: string;
  tiles: React.ReactNode[];
}

const sections: Section[] = [
  {
    title: "TIMELINE",
    background: "#AFD157",
    tiles: [<TimelineTile1 key="1" />, <TimelineTile2 key="2" />],
  },
  {
    title: "JUDGES",
    background: "#9EE7E5",
    tiles: [<JudgesTile1 key="1" />, <JudgesTile2 key="2" />],
  },
  {
    title: "POST DEMO",
    background: "#FFC5AB",
    tiles: [<PostDemoTile1 key="1" />],
  },
];

export default function DemoTime() {
  return (
    <div className={styles.container}>
      {sections.map(({ title, background, tiles }, index) => (
        <div key={index} className={styles.section}>
          <p>{title}</p>
          <div className={styles.tiles}>
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={styles.tile}
                style={{ backgroundColor: background }}
              >
                {tile}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
