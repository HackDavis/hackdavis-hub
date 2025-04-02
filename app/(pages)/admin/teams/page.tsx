'use client';

import { useState } from 'react';
import { useTeams } from '@pages/_hooks/useTeams';
import styles from './page.module.scss';
import TeamCard from '../_components/Teams/TeamCard';
import Team from '@typeDefs/team';

export default function Teams() {
  const [search, setSearch] = useState('');
  const { loading, teams } = useTeams();
  if (loading) {
    return 'loading...';
  }

  if (!teams.ok) {
    return teams.error;
  }

  const teamData = teams.body
    .filter((team: Team) =>
      JSON.stringify(team).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: Team, b: Team) => a.teamNumber - b.teamNumber);

  console.log(teamData);

  return (
    <div className={styles.container}>
      <div className={styles.search_bar}>
        <label htmlFor="search">Search</label>
        <input
          name="search"
          type="text"
          value={search}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>
      <div className={styles.teams_list}>
        {teamData.map((team: Team) => (
          <TeamCard key={team._id} team={team} />
        ))}
      </div>
    </div>
  );
}
