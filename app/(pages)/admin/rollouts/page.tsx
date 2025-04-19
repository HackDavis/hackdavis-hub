'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import { GoSearch } from 'react-icons/go';
import useFormContext from '../_hooks/useFormContext';
import useRollouts from '@pages/_hooks/useRollouts';
import Rollout from '@typeDefs/rollout';
import RolloutForm from '../_components/Rollouts/RolloutForm';
import RolloutCard from '../_components/Rollouts/RolloutCard';
import { deleteRollout } from '@actions/rollouts/deleteRollout';

export default function Rollouts() {
  const [search, setSearch] = useState('');
  const { loading, rolloutsRes, fetchRollouts } = useRollouts();
  const { data, setData } = useFormContext();
  const isEditing = Boolean(data._id);

  if (loading) {
    return 'loading...';
  }

  if (!rolloutsRes.ok) {
    return rolloutsRes.error;
  }

  const rollouts: Rollout[] = rolloutsRes.body.sort(
    (a: Rollout, b: Rollout) => {
      if (a.rollback_time === b.rollback_time) {
        if (a.rollback_time && b.rollback_time) {
          return a.rollback_time - b.rollback_time;
        }
        return a.rollback_time ? -1 : 1;
      }
      return a.rollout_time - b.rollout_time;
    }
  );

  const deleteSingleRollout = async (rollout_id: string) => {
    await deleteRollout(rollout_id);
    fetchRollouts();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.page_title}>Rollout Manager</h1>
      <h2 className={styles.action_header}>
        {isEditing ? 'Edit' : 'Create'} Rollout
      </h2>
      <RolloutForm
        cancelAction={() => setData({})}
        revalidate={fetchRollouts}
      />
      <hr />
      <h2 className={styles.action_header}>View Rollouts</h2>
      <div className={styles.search_bar}>
        <input
          name="search"
          type="text"
          value={search}
          placeholder="Filter rollouts"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <GoSearch className={styles.search_icon} />
      </div>
      <div className={styles.data_portion}>
        <div className={styles.rollout_list}>
          {rollouts.map((rollout: Rollout) => (
            <div className={styles.rollout_card_wrapper} key={rollout._id}>
              <RolloutCard
                rollout={rollout}
                onEditClick={() => setData(rollout)}
                onDeleteClick={() => deleteSingleRollout(rollout._id ?? '')}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
