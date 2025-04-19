'use client';
import styles from './TeamForm.module.scss';
import useFormContext from '@pages/admin/_hooks/useFormContext';

import ShortInput from '../ShortInput/ShortInput';
import ListInput from '../ListInput/ListInput';
import DropdownInput from '../DropdownInput/DropdownInput';
import JudgeCard from '../Judges/JudgeCard';

import { IoTrashOutline } from 'react-icons/io5';
import { IoIosArrowRoundUp, IoIosArrowRoundDown } from 'react-icons/io';

import { useJudges } from '@pages/_hooks/useJudges';
import { createTeam } from '@actions/teams/createTeam';
import { updateTeamWithJudges } from '@actions/teams/updateTeamWithJudges';
import { HttpError } from '@utils/response/Errors';

import User from '@typeDefs/user';
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
  const { loading, judges, getJudges } = useJudges();

  if (loading) return '...loading';
  if (!judges.ok) return judges.error;

  const judgeOptions = judges.body.map((judge: any) => ({
    option: `${judge.name} - ${judge._id}`,
    value: judge,
  }));

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
          field: 'judges',
          validation: (judges: User[]) => {
            const serializedJudges = judges.map((judge) => judge._id);
            const judgeSet = new Set(serializedJudges);
            return judges.length === judgeSet.size;
          },
        },
        {
          field: 'active',
          validation: (active: any) => active === true || active === false,
        },
      ];

      verificationList.forEach(({ field, validation }) => {
        if (!validation(data?.[field])) {
          throw new Error(`Form field ${field} failed validation.`);
        }
      });
    } catch (e) {
      const error = e as HttpError;
      alert(error.message);
      return;
    }

    const { _id, submissions: _, judges: __, ...body } = data;

    let team_id = _id;
    if (!team_id) {
      const createRes = await createTeam(body);
      if (!createRes.ok) {
        throw new Error(createRes?.error ?? '');
      }
      team_id = createRes.body?._id;
    }

    const res = await updateTeamWithJudges(
      team_id,
      { $set: body },
      judges.body
    );

    if (res.ok) {
      setData({});
      revalidate();
      getJudges();
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
      <ListInput
        label="judges"
        value={data.judges}
        direction="column"
        updateValue={(value: any) => updateField('judges', value)}
        itemRenderer={({ key, item, deleteItem, shiftUp, shiftDown }) => {
          return (
            <div key={key} className={styles.judge_card_wrapper}>
              <JudgeCard judge={item} editable={false} />
              <div className={styles.judge_card_list_options}>
                <div className={styles.trash_icon} onClick={deleteItem}>
                  <IoTrashOutline />
                </div>
                <div className={styles.shift_up} onClick={shiftUp}>
                  <IoIosArrowRoundUp />
                </div>
                <div className={styles.shift_down} onClick={shiftDown}>
                  <IoIosArrowRoundDown />
                </div>
              </div>
            </div>
          );
        }}
        addRenderer={({ addItem }) => {
          return (
            <DropdownInput
              label="new judge"
              value={null}
              updateValue={(value: any) => addItem(value)}
              width="100%"
              options={judgeOptions}
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
