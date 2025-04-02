import styles from './Break.module.scss';
import hackathon from '@public/hackers/project-info/hackathon.svg';
import Image from 'next/image';

export default function Break() {
  return (
    <div>
      <div>
        <h3>Hacker’s Choice Award</h3>
        <p>
          Once demos end, you will about an hour’s time to visit other teams and
          vote for the Hacker’s Choice Award. You can also look at projects in
          the gallery on devpost.
        </p>
        <p>
          Meanwhile, panels of judges will be choosing the winners from the top
          5 projects shortlisted for each track after demos.
        </p>
        <button>Submit Vote</button>
      </div>
    </div>
  );
}
