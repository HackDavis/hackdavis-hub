"use client";

import Image from "next/image";
import ProjectInfoAccordion, {
  AccordionItemInt,
} from "../ProjectInfoAccordion/ProjectInfoAccordion";
import ResourceHelp from "../../StarterKit/Resources/ResourceHelp";
import StarterKitSlide from "../../StarterKit/StarterKitSlide";
import SubmissionTips from "./SubmissionSteps/DevpostSubmission/SubmissionTips";
import Clarifications from "./SubmissionSteps/SubmissionClarification/Clarifications";

import LoginToDevpost from "./SubmissionSteps/LoginToDevpost/LoginToDevpost";
import InviteTeammates from "./SubmissionSteps/InviteTeammates/InviteTeammates";
import FillOutDetails from "./SubmissionSteps/FillOutDetails/FillOutDetails";
import SubmitProject from "./SubmissionSteps/SubmitProject/SubmitProject";

// import Blank from 'public/hackers/project-info/Step6.svg';
import Step2Overlay from "public/hackers/project-info/Step2Overlay.svg";
import Step3Overlay from "public/hackers/project-info/Step3Overlay.svg";
import GrassDivider from "public/hackers/project-info/GrassDivider.svg";

import registerForTheEvent from "public/hackers/project-info/registerForTheEvent.png";
import createAProject from "public/hackers/project-info/createAProject.png";

import styles from "./SubmissionInfo.module.scss";

const accordionItems: AccordionItemInt[] = [
  {
    subtitle: "Step 1",
    title: "Login to Devpost",
    content: <LoginToDevpost />,
  },
  {
    subtitle: "Step 2",
    title: "Register for the Event",
    content: (
      <div className={styles.step2}>
        <div className={styles.imageWrapper}>
          <div className={styles.primaryImageWrapper}>
            <Image
              src={registerForTheEvent} // primary image
              alt="Primary Step 1"
              fill
              // style={{ objectFit: 'contain' }}
              className={styles.primaryImage}
            />
          </div>
          <Image
            src={Step2Overlay} // your new overlay image
            alt="Overlay"
            // fill
            // style={{ objectFit: 'contain' }}
            className={styles.overlayImage}
          />
        </div>
        <p className={styles.stepText}>Register for the event.</p>
      </div>
    ),
  },
  {
    subtitle: "Step 3",
    title: "Create a Project",
    content: (
      <div className={styles.step3}>
        <div className={styles.imageWrapper}>
          <div className={styles.primaryImageWrapper}>
            <Image
              src={createAProject} // primary image
              alt="Primary Step 1"
              fill
              // style={{ objectFit: 'contain' }}
              className={styles.primaryImage}
            />
          </div>
          <Image
            src={Step3Overlay} // your new overlay image
            alt="Overlay"
            // fill
            // style={{ objectFit: 'contain' }}
            className={styles.overlayImage}
          />
        </div>
        <p className={styles.stepText}>
          Click Create project. Only one person per team has to create a project
          and complete the next steps.
        </p>
      </div>
    ),
  },
  {
    subtitle: "Step 4",
    title: "Invite Teammates",
    content: <InviteTeammates />,
  },
  {
    subtitle: "Step 5",
    title: "Fill Out Details",
    content: <FillOutDetails />,
  },
  {
    subtitle: "Step 6",
    title: "Submit Project",
    content: <SubmitProject />,
  },
];

export default function SubmissionInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.submissionProcess}>
        <h6> THIS IS OUR </h6>
        <h4> Submission Process</h4>
      </div>
      <ProjectInfoAccordion accordionItems={accordionItems} />
      <div className={styles.GrassDivider}>
        <Image
          src={GrassDivider}
          alt="Grass Divider"
          className={styles.grass_image}
        />
      </div>
      <div className={styles.tips}>
        <SubmissionTips />
        <Clarifications />
        <StarterKitSlide
          title="You're Ready!"
          subtitle="AND NOW"
          route="project-info"
        >
          <ResourceHelp />
        </StarterKitSlide>
      </div>
    </div>
  );
}
