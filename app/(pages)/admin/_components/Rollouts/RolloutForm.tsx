'use client';
import styles from './RolloutForm.module.scss';

import ShortInput from '../ShortInput/ShortInput';
import useFormContext from '@pages/admin/_hooks/useFormContext';
import { updateRollout } from '@actions/rollouts/updateRollout';
import { createRollout } from '@actions/rollouts/createRollout';

import DateTimeInput from '../DateTimeInput/DateTimeInput';

interface RolloutFormProps {
  cancelAction?: () => void;
  revalidate?: () => void;
}

export default function RolloutForm({
  cancelAction = () => {},
  revalidate = () => {},
}: RolloutFormProps) {
  const { data, updateField, setData } = useFormContext();

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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { _id, ...body } = data;

    if (!_id) {
      const createRes = await createRollout(body);
      if (createRes.ok) {
        setData({});
        revalidate();
      } else {
        alert(createRes.error);
      }
    } else {
      const updateRes = await updateRollout(_id, { $set: body });
      if (updateRes.ok) {
        setData({});
        revalidate();
      } else {
        alert(updateRes.error);
      }
    }
  };

  const rolloutTimeDate = data.rollout_time
    ? formatDate(data.rollout_time)
    : '';

  const rollbackTimeDate = data.rollback_time
    ? formatDate(data.rollback_time)
    : '';

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <ShortInput type="text" label="id" value={data._id ?? ''} disabled />
      <ShortInput
        type="text"
        label="component key (featureId)"
        value={data.component_key ?? ''}
        updateValue={(newComponentKey) =>
          updateField('component_key', newComponentKey)
        }
        required
      />
      <DateTimeInput
        label="rollout time"
        value={rolloutTimeDate}
        updateValue={(newRolloutTime) => {
          updateField('rollout_time', new Date(newRolloutTime).getTime());
        }}
        required
      />
      <DateTimeInput
        label="rollback time (optional)"
        value={rollbackTimeDate}
        updateValue={(newRollbackTime) => {
          updateField('rollback_time', new Date(newRollbackTime).getTime());
        }}
      />
      <div className={styles.action_buttons}>
        <button className={styles.submit_button} type="submit">
          Submit
        </button>
        <button className={styles.cancel_button} onClick={cancelAction}>
          Cancel
        </button>
      </div>
    </form>
  );
}
