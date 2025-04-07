'use client';
import styles from './TeamForm.module.scss';
import ShortInput from '../ShortInput/ShortInput';
import useFormContext from '@pages/admin/_hooks/useFormContext';
import ListInput from '../ListInput/ListInput';
import { IoTrashOutline } from 'react-icons/io5';
import DropdownInput from '../DropdownInput/DropdownInput';
import { updateTeam } from '@actions/teams/updateTeam';
import { createTeam } from '@actions/teams/createTeam';

import tracksAndDomains from '@data/db_validation_data.json';

interface TeamFormProps {
  cancelAction?: () => void;
  revalidate?: () => void;
}

export default function TeamForm({
  cancelAction = () => {},
  revalidate = () => {},
}: TeamFormProps) {
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

    const res = !_id
      ? await createTeam(body)
      : await updateTeam(_id, { $set: body });

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
        type="number"
        label="team number"
        value={!isNaN(data.teamNumber) ? data.teamNumber : null}
        updateValue={(newTeamNumber) =>
          updateField('teamNumber', newTeamNumber)
        }
        required
      />
      <ShortInput
        type="number"
        label="table number"
        value={!isNaN(data.tableNumber) ? data.tableNumber : null}
        updateValue={(newTableNumber) =>
          updateField('tableNumber', newTableNumber)
        }
        required
      />
      <ListInput
        label="tracks"
        value={data.tracks}
        updateValue={(value: any) => updateField('tracks', value)}
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
              label="new track"
              value={null}
              updateValue={(value: any) => addItem(value)}
              width="400px"
              options={tracksAndDomains.tracks.map((track) => ({
                option: track,
                value: track,
              }))}
            />
          );
        }}
      />
      <DropdownInput
        label="active"
        value={data.active}
        updateValue={(value: any) => updateField('active', value)}
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
