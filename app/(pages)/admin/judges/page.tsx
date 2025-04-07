'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import BarChart from '../_components/BarChart/BarChart';
import { GoSearch } from 'react-icons/go';
import useFormContext from '../_hooks/useFormContext';
import User from '@typeDefs/user';
import Team from '@typeDefs/team';
import { useJudges } from '@pages/_hooks/useJudges';
import JudgeCard from '../_components/Judges/JudgeCard';
import JudgeForm from '../_components/Judges/JudgeForm';

interface JudgeWithTeams extends User {
  teams: Team[];
}

export default function Judges() {
  const [search, setSearch] = useState('');
  const { loading, judges, getJudges } = useJudges();
  const { data, setData } = useFormContext();
  const isEditing = Boolean(data._id);

  if (loading) {
    return 'loading...';
  }

  if (!judges.ok) {
    return judges.error;
  }

  const judgeData: JudgeWithTeams[] = judges.body
    .filter((team: JudgeWithTeams) =>
      JSON.stringify(team).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: JudgeWithTeams, b: JudgeWithTeams) =>
      a.name.localeCompare(b.name)
    );

  const chartData = judgeData.map((judge) => ({
    key: judge._id as string,
    label: judge.name,
    value: judge.teams.length,
    backgroundColor: '#9EE7E5',
  }));

  return (
    <div className={styles.container}>
      <h1 className={styles.page_title}>Judge Manager</h1>
      <h2 className={styles.action_header}>
        {isEditing ? 'Edit' : 'Create'} Judge
      </h2>
      <JudgeForm cancelAction={() => setData({})} revalidate={getJudges} />
      <hr />
      <h2 className={styles.action_header}>View Judges</h2>
      <div className={styles.search_bar}>
        <input
          name="search"
          type="text"
          value={search}
          placeholder="Filter judges"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <GoSearch className={styles.search_icon} />
      </div>
      <div className={styles.data_portion}>
        <div className={styles.judge_list}>
          {judgeData.map((judge: JudgeWithTeams) => (
            <JudgeCard
              key={judge._id}
              judge={judge}
              onEditClick={() => setData(judge)}
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
    </div>
  );
}
