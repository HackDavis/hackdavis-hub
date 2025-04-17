'use client';

import Loader from '@pages/_components/Loader/Loader';
import { useEffect, useState } from 'react';
import {AddRolloutForm, UpdateRolloutForm} from '../_components/RolloutForms/RolloutForms';
import Rollout from '@typeDefs/rollout';
import { getManyRollouts } from '@actions/rollouts/getRollouts';
import { deleteRollout } from '@actions/rollouts/deleteRollout';

export default function Rollouts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rollouts, setRollouts] = useState<Rollout[]>([]);
  const [rolloutToEdit, setRolloutToEdit] = useState<string | null>(null);
  const [refreshRollouts, setRefreshRollouts ] = useState(false);

  // something is wrong here but im too sleepy
  const handleDelete = async (id: string | null) => {
    setLoading(true)
    if (!id) setError('No ID found for delete');
    try {
      const deleteRes = await deleteRollout(id ?? '');
      if (!deleteRes.ok) throw new Error('Failed to delete rollout');

      setRefreshRollouts(true)
    } catch (e) {
      setError((e as Error).message);
    }
    setRefreshRollouts(false);
    setLoading(false);
  }

  useEffect (() => {
    const fetchRollouts = async () => {
      setLoading(true);
      setError('');
      setRollouts([]);
      try {
        const rolloutsRes = await getManyRollouts();
        if(!rolloutsRes.ok) throw new Error(rolloutsRes.error);

        setRollouts(rolloutsRes.body)
      } catch (e) {
        setError((e as Error).message);
      }
      setLoading(false);
    }
    fetchRollouts();
  }, [rolloutToEdit, refreshRollouts])

  return (
    <div className="flex flex-col w-3/4 m-auto py-20 gap-12">
      {loading && <Loader />}
      <div>
        <p className='text-text-error'>{error}</p>
        {rolloutToEdit ? 
          <>
            <h3>Edit {rolloutToEdit}</h3>
            <UpdateRolloutForm setLoading={setLoading} setError={setError} rollout={rollouts.find((r) => r._id === rolloutToEdit)} setRolloutToEdit={setRolloutToEdit}/>
          </>
          :
          <>
            <h3>Add Rollout:</h3>
            <AddRolloutForm setLoading={setLoading} setError={setError} />
          </>
        }
      </div>
      <div>
        <h3>Rollouts:</h3>
        {rollouts.length === 0 ? 
        !loading && <p>No rollouts in DB!</p>
        :
        <div className='h-[30vh] overflow-y-scroll bg-background-light p-4'>
          {rollouts.map((roll, idx) => {
            const rollout_time = new Date(roll.rollout_time).toString();
            let rollback_time;
            if(roll.rollback_time)
              rollback_time = new Date(roll.rollback_time).toString();
            return (
            <div key={idx} className='bg-slate-200 rounded-md p-2 flex justify-between'>
              <div>
              <p>{roll.component_key}</p>
              <p>{rollout_time}</p>
              {rollback_time && <p>{rollback_time}</p>}
              </div>
              <div className='flex gap-2'>
                <button className='bg-red-400 rounded p-2' onClick={() => handleDelete(roll._id ?? null)}>delete</button>
                <button className='bg-yellow-400 rounded p-2' onClick={() => setRolloutToEdit(roll._id ?? null)}>edit</button>
              </div>
            </div>
          )})}
        </div>}
      </div>
    </div>
  );
}
