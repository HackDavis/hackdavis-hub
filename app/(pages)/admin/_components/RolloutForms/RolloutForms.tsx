'use client';

import { createRollout } from '@actions/rollouts/createRollout';
import updateRollout from '@actions/rollouts/updateRollout';
import Rollout from '@typeDefs/rollout';
import { FormEvent, Dispatch, SetStateAction, useState, useEffect } from 'react';

interface RolloutFormProps {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function AddRolloutForm({ setLoading, setError }: RolloutFormProps) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setLoading(true);
      setError('');

      const formData = new FormData(e.currentTarget);
      const component_key = formData.get('component_key') as string;
      const rollout_time = formData.get('rollout_time') as string;
      const rollback_time = formData.get('rollback_time') as string;

      if (!rollout_time) {
        setError('Rollout time is missing or could not be converted to date.');
      }

      const rolloutRes = await createRollout(
        rollback_time
          ? {
              component_key,
              rollout_time: new Date(rollout_time).getTime(),
              rollback_time: new Date(rollback_time).getTime(),
            }
          : {
              component_key,
              rollout_time: new Date(rollout_time).getTime(),
            }
      );

      if (!rolloutRes.ok) throw new Error(rolloutRes.error);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <input
        name="component_key"
        type="text"
        required
        placeholder="Component Key"
      />
      <div className="flex gap-12 justify-between">
        <div className='flex items-start flex-col'>
        <label className="mt-4" htmlFor="rollout_time">
          Rollout time:
        </label>
        <input name="rollout_time" type="datetime-local" required />
          
        </div>
        <div className='flex items-start flex-col'>

        <label className="mt-4" htmlFor="rollback_time">
          Rollback time (Optional):
        </label>
        <input name="rollback_time" type="datetime-local" />
        </div>
      <button className="bg-background-light" type="submit">
        Add Rollout
      </button>
      </div>
    </form>
  );
}

interface UpdateFormProps extends RolloutFormProps {
  rollout?: Rollout;
  setRolloutToEdit: Dispatch<SetStateAction<string | null>>
}

export function UpdateRolloutForm({ setLoading, setError, rollout, setRolloutToEdit }: UpdateFormProps) {
  if (!rollout) {
    setError('no rollout to edit found')
    return;
  }

  // Format epoch time to the required datetime-local format (YYYY-MM-DDTHH:MM)
  const formatDate = (epochTime: number): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Los_Angeles',
    };

    const formattedDate = new Date(epochTime).toLocaleString('en-US', options);

    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');

    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  // State for form values
  const [componentKey, setComponentKey] = useState(rollout.component_key);
  const [rolloutTime, setRolloutTime] = useState(formatDate(rollout.rollout_time));
  const [rollbackTime, setRollbackTime] = useState(rollout.rollback_time ? formatDate(rollout.rollback_time) : '');

  useEffect(() => {
    // Initialize values when rollout is updated
    setComponentKey(rollout.component_key);
    setRolloutTime(formatDate(rollout.rollout_time));
    setRollbackTime(rollout.rollback_time ? formatDate(rollout.rollback_time) : '');
  }, [rollout]);

  

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      if(!rollout._id)
        throw new Error('rollout ID not found');

      // Create a FormData object to extract form values
      const formData = new FormData(e.currentTarget);
      const component_key = formData.get('component_key') as string;
      const rollout_time = formData.get('rollout_time') as string;
      const rollback_time = formData.get('rollback_time') as string;

      const payload: any = {
        component_key,
        rollout_time: new Date(rollout_time).getTime(),
      };

      if (rollback_time) {
        payload.rollback_time = new Date(rollback_time).getTime();
      }

      // Simulate an API call for creating or updating a rollout
      const rolloutRes = await updateRollout(rollout._id, payload);

      if (!rolloutRes.ok) 
        throw new Error(rolloutRes.error?? 'failed to update rollout');
      
      setRolloutToEdit(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <div className="mb-4">
        <label htmlFor="component_key">Component Key:</label>
        <input
          name="component_key"
          type="text"
          required
          value={componentKey}
          onChange={(e) => setComponentKey(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="flex gap-12 justify-between">
        <div className="flex items-start flex-col">
          <label className="mt-4" htmlFor="rollout_time">
            Rollout Time:
          </label>
          <input
            name="rollout_time"
            type="datetime-local"
            required
            value={rolloutTime}
            onChange={(e) => setRolloutTime(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex items-start flex-col">
          <label className="mt-4" htmlFor="rollback_time">
            Rollback Time (Optional):
          </label>
          <input
            name="rollback_time"
            type="datetime-local"
            value={rollbackTime}
            onChange={(e) => setRollbackTime(e.target.value)}
            className="input-field"
          />
        </div>

        <button className="bg-background-light mt-4" type="submit">
          Update Rollout
        </button>
      </div>

    </form>
  );
}
