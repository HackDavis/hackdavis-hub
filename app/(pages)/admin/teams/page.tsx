'use client';

import { useState } from 'react';
import { useTeams } from '@pages/_hooks/useTeams';
import { GoSearch } from 'react-icons/go';
import TeamCard from '../_components/Teams/TeamCard';
import Team from '@typeDefs/team';
import User from '@typeDefs/user';
import BarChart from '../_components/BarChart/BarChart';
import TeamForm from '../_components/Teams/TeamForm';
import useFormContext from '../_hooks/useFormContext';
import styles from './page.module.scss';

interface TeamWithJudges extends Team {
  judges: User[];
}

export default function Teams() {
  const [search, setSearch] = useState('');
  const { loading, teams, getTeams } = useTeams();
  const { data, setData } = useFormContext();
  const isEditing = Boolean(data._id);
  const [reportedTeamsDisplay, setReportedTeamsDisplay] = useState(false);

  if (loading) {
    return 'loading...';
  }

  if (!teams.ok) {
    return teams.error;
  }

  function toggleReportedTeamsDisplay() {
    setReportedTeamsDisplay(!reportedTeamsDisplay);
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

  const reportedTeams = teamData.filter((team) => team.reports?.length > 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.page_title}>Team Manager</h1>
      <h2 className={styles.action_header}>
        {isEditing ? 'Edit' : 'Create'} Team
      </h2>
      <TeamForm cancelAction={() => setData({})} revalidate={getTeams} />
      <hr />
      <h2 className={styles.action_header}>View Teams</h2>
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
      <div>
        <div className={styles.reported_teams_container}>
          <button onClick={toggleReportedTeamsDisplay}>
            {reportedTeamsDisplay ? 'v' : '>'}
          </button>
          <h2 className={styles.action_header}> Reported Teams</h2>
        </div>
        <div className={styles.reports_container}>
          {reportedTeamsDisplay &&
            reportedTeams.map((team) => (
              <div className={styles.report_container} key={team._id}>
                {/* prettier-ignore */}
                <a href={`#${team._id}`}>
                  Team #{team.teamNumber}: {team.name} @Table {team.tableNumber}
                </a>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.data_portion}>
        <div className={styles.teams_list}>
          {teamData.map((team: TeamWithJudges) => (
            <div
              id={team._id}
              className={styles.team_card_wrapper}
              key={team._id}
            >
              <TeamCard team={team} onEditClick={() => setData(team)} />
            </div>
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
