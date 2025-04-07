import Team from '@typeDefs/team';
import styles from './TrackList.module.scss';

interface TrackListProps {
  team: Team;
}

export default function TrackList({ team }: TrackListProps) {
  return (
    <div className={styles.container}>
      {team.tracks.map((track: string) => (
        <div key={track} className={styles.track_container}>
          {track}
        </div>
      ))}
    </div>
  );
}
