"use client";

import { useState } from "react";
import SubmissionInfo from "../SubmissionInfo/SubmissionInfo";
import JudgingInfo from "../JudgingInfo/JudgingInfo";
import styles from "./WhatHappens.module.scss";

export default function WhatHappens() {
  const [activeTab, setActiveTab] = useState<"submission" | "judging">(
    "submission",
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <div className={styles.beginningText}>
          <div className={styles.commonHeader}>
            <h2>What happens during the...</h2>
            <div className={styles.processButtons}>
              <button
                className={activeTab === "submission" ? styles.selected : ""}
                onClick={() => setActiveTab("submission")}
              >
                Submission Process
              </button>
              <button
                className={activeTab === "judging" ? styles.selected : ""}
                onClick={() => setActiveTab("judging")}
              >
                Judging Process
              </button>
            </div>
          </div>

          <div>
            {activeTab === "submission" && (
              <section>
                <SubmissionInfo />
              </section>
            )}

            {activeTab === "judging" && (
              <section>
                <JudgingInfo />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
