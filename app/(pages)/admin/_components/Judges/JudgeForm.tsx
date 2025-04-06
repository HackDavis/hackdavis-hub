'use client';
import styles from './JudgeForm.module.scss';
import ShortInput from '../ShortInput/ShortInput';
import useFormContext from '@pages/admin/_hooks/useFormContext';
import ListInput from '../ListInput/ListInput';
import { IoTrashOutline } from 'react-icons/io5';
import DropdownInput from '../DropdownInput/DropdownInput';
import tracks from '@data/tracks';
import { updateTeam } from '@actions/teams/updateTeam';
import { createTeam } from '@actions/teams/createTeam';
import TeamCard from '../Teams/TeamCard';

interface JudgeFormProps {
  cancelAction?: () => void;
  revalidate?: () => void;
}

export default function JudgeForm({
  cancelAction = () => {},
  revalidate = () => {},
}: JudgeFormProps) {
  const { data, updateField, setData } = useFormContext();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let dataIsValid;

    try {
      const verificationList = [
        {
          field: 'teamNumber',
          validation: Number.isFinite,
        },
        {
          field: 'tableNumber',
          validation: Number.isFinite,
        },
        {
          field: 'name',
          validation: (name: any) => name?.length > 0,
        },
        {
          field: 'tracks',
          validation: (tracks: any) =>
            tracks.every((track: any) => track?.length > 0),
        },
        {
          field: 'active',
          validation: (active: any) => active === true || active === false,
        },
      ];
      dataIsValid = verificationList.every(({ field, validation }) =>
        validation(data?.[field])
      );
    } catch {
      dataIsValid = false;
    }

    if (!dataIsValid) {
      alert('Form has invalid data');
    }

    const { _id, submissions: _, judges: __, ...body } = data;

    const res = !_id ? await createTeam(body) : await updateTeam(_id, body);

    if (res.ok) {
      setData({});
      revalidate();
    } else {
      alert(res.error);
    }
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <ShortInput type="text" label="id" value={data._id ?? ''} disabled />
      <ShortInput
        type="text"
        label="name"
        value={data.name ?? ''}
        updateValue={(newName) => updateField('name', newName)}
        required
      />
      <ShortInput
        type="text"
        label="email"
        value={data.email ?? ''}
        updateValue={(newEmail) => updateField('email', newEmail)}
        required
      />
      <DropdownInput
        label="role"
        value={data.role}
        updateValue={(value: any) => updateField('role', value)}
        width="400px"
        options={[
          { option: 'hacker', value: 'hacker' },
          { option: 'judge', value: 'judge' },
          { option: 'admin', value: 'admin' },
        ]}
      />
      <ListInput
        label="specialties"
        value={data.specialties}
        updateValue={(value: any) => updateField('specialties', value)}
        itemRenderer={({ key, item, deleteItem }) => {
          return (
            <div key={key} className={styles.track_item}>
              {item}
              <div className={styles.trash_icon} onClick={deleteItem}>
                <IoTrashOutline />
              </div>
            </div>
          );
        }}
        addRenderer={({ addItem }) => {
          return (
            <DropdownInput
              label="new specialty"
              value={null}
              updateValue={(value: any) => addItem(value)}
              width="400px"
              options={['tech', 'design', 'business'].map((track) => ({
                option: track,
                value: track,
              }))}
            />
          );
        }}
      />
      <ListInput
        label="teams"
        value={data.teams}
        updateValue={(value: any) => updateField('teams', value)}
        itemRenderer={({ key, item, deleteItem }) => {
          return (
            <div key={key}>
              <TeamCard team={item} />
              <div className={styles.trash_icon} onClick={deleteItem}>
                <IoTrashOutline />
              </div>
            </div>
          );
        }}
        addRenderer={({ addItem }) => {
          return (
            <DropdownInput
              label="new specialty"
              value={null}
              updateValue={(value: any) => addItem(value)}
              width="400px"
              options={['tech', 'design', 'business'].map((track) => ({
                option: track,
                value: track,
              }))}
            />
          );
        }}
      />
      <DropdownInput
        label="check in"
        value={data.has_checked_in}
        updateValue={(value: any) => updateField('has_checked_in', value)}
        width="400px"
        options={[
          { option: 'true', value: true },
          { option: 'false', value: false },
        ]}
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
