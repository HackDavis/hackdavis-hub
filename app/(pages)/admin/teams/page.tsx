'use client';

import { useState } from 'react';
import { useTeams } from '@pages/_hooks/useTeams';
import styles from './page.module.scss';
import TeamCard from '../_components/Teams/TeamCard';
import Team from '@typeDefs/team';
import User from '@typeDefs/user';
import BarChart from '../_components/BarChart/BarChart';
import { GoSearch } from 'react-icons/go';
import TeamForm from '../_components/Teams/TeamForm';
import useFormContext from '../_hooks/useFormContext';

interface TeamWithJudges extends Team {
  judges: User[];
}

export default function Teams() {
  const [search, setSearch] = useState('');
  const { loading, teams, getTeams } = useTeams();
  const { data, setData } = useFormContext();
  const isEditing = Boolean(data._id);

  if (loading) {
    return 'loading...';
  }

  if (!teams.ok) {
    return teams.error;
  }

  const teamData: TeamWithJudges[] = teams.body
    .filter((team: TeamWithJudges) =>
      JSON.stringify(team).toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a: TeamWithJudges, b: TeamWithJudges) => a.teamNumber - b.teamNumber
    );

  const chartData = teamData.map((team) => ({
    key: team._id as string,
    label: team.name,
    value: team.judges.length,
    backgroundColor: '#9EE7E5',
  }));

  return (
    <div className={styles.container}>
      <h1 className={styles.page_title}>Team Manager</h1>
      <div className={styles.search_bar}>
        <input
          name="search"
          type="text"
          value={search}
          placeholder="Filter teams"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <GoSearch className={styles.search_icon} />
      </div>
      <div className={styles.data_portion}>
        <div className={styles.teams_list}>
          {teamData.map((team: TeamWithJudges) => (
            <TeamCard
              key={team._id}
              team={team}
              onEditClick={() => setData(team)}
            />
          ))}
        </div>
        <div className={styles.bar_chart_container}>
          <BarChart
            data={chartData}
            lines={[{ style: 'dashed 1px red', value: 3 }]}
          />
        </div>
      </div>
      <h2 className={styles.action_header}>
        {isEditing ? 'Edit' : 'Create'} Team
      </h2>
      <TeamForm cancelAction={() => setData({})} revalidate={getTeams} />
    </div>
  );
}
