'use client';
import styles from './JudgeForm.module.scss';
import ShortInput from '../ShortInput/ShortInput';
import useFormContext from '@pages/admin/_hooks/useFormContext';
import { useTeams } from '@pages/_hooks/useTeams';
import ListInput from '../ListInput/ListInput';
import { IoTrashOutline } from 'react-icons/io5';
import {
  IoIosArrowRoundUp,
  IoIosArrowRoundDown,
  IoIosArrowRoundBack,
  IoIosArrowRoundForward,
} from 'react-icons/io';

import DropdownInput from '../DropdownInput/DropdownInput';
import TeamCard from '../Teams/TeamCard';

import tracksAndDomains from '@data/db_validation_data.json';
import { updateJudgeWithTeams } from '@actions/judges/updateJudgeWithTeams';
import { HttpError } from '@utils/response/Errors';
import Team from '@typeDefs/team';

interface JudgeFormProps {
  cancelAction?: () => void;
  revalidate?: () => void;
}

export default function JudgeForm({
  cancelAction = () => {},
  revalidate = () => {},
}: JudgeFormProps) {
  const { data, updateField, setData } = useFormContext();
  const { loading, teams, getTeams } = useTeams();

  if (loading) {
    return '...loading';
  }

  if (!teams.ok) {
    return teams.error;
  }

  const teamOptions = teams.body.map((team: any) => ({
    option: `${team.name} - ${team._id}`,
    value: team,
  }));

  const teamMap = Object.fromEntries(
    teams.body.map((team: any) => [team._id, team])
  );

  if (data?._id && data.teams) {
    data.teams = data.teams
      .map((team: any) => {
        // Handle case where team might be just an ID string or already be a full team object
        if (typeof team === 'string') {
          return teamMap[team] || team;
        }
        return team._id ? teamMap[team._id] || team : team;
      })
      .filter(Boolean); // Remove any undefined teams
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const verificationList = [
        {
          field: 'name',
          validation: (name: any) => name?.length > 0,
        },
        {
          field: 'email',
          validation: (email: any) => email?.length > 0,
        },
        {
          field: 'role',
          validation: (role: any) => role?.length > 0,
        },
        {
          field: 'specialties',
          validation: (specialties: any) =>
            (specialties ?? []).every(
              (specialty: any) => specialty?.length > 0
            ),
        },
        {
          field: 'teams',
          validation: (teams: Team[]) => {
            const serializedTeams = teams.map((teams) => teams._id);
            const teamSet = new Set(serializedTeams);
            return teams.length === teamSet.size;
          },
        },
        {
          field: 'has_checked_in',
          validation: (has_checked_in: any) =>
            has_checked_in === true || has_checked_in === false,
        },
        {
          field: 'opted_into_panels',
          validation: (opted_into_panels: any) =>
            opted_into_panels === true || opted_into_panels === false,
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

    const {
      _id,
      name,
      email,
      role,
      specialties,
      teams,
      has_checked_in,
      opted_into_panels,
    } = data;
    const body = {
      name,
      email,
      role,
      specialties,
      has_checked_in,
      opted_into_panels,
    };

    const res = await updateJudgeWithTeams(_id, { $set: body }, teams);

    if (res.ok) {
      setData({});
      revalidate();
      getTeams();
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
        itemRenderer={({ key, item, deleteItem, shiftUp, shiftDown }) => {
          return (
            <div key={key} className={styles.track_item}>
              {item}
              <div className={styles.shift_up} onClick={shiftUp}>
                <IoIosArrowRoundBack />
              </div>
              <div className={styles.shift_down} onClick={shiftDown}>
                <IoIosArrowRoundForward />
              </div>
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
              options={tracksAndDomains.domains.map((track) => ({
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
        direction="column"
        updateValue={(value: any) => updateField('teams', value)}
        itemRenderer={({ key, item, deleteItem, shiftUp, shiftDown }) => {
          return (
            <div key={key} className={styles.team_card_wrapper}>
              {/* <TeamCard team={item} editable={false} /> */}
              <div className={styles.team_card_list_options}>
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
              label="new team"
              value={null}
              updateValue={(value: any) => addItem(value)}
              width="100%"
              options={teamOptions}
            />
          );
        }}
      />
      <DropdownInput
        label="checked in"
        value={data.has_checked_in}
        updateValue={(value: any) => updateField('has_checked_in', value)}
        width="400px"
        options={[
          { option: 'true', value: true },
          { option: 'false', value: false },
        ]}
      />
      <DropdownInput
        label="opted into panels"
        value={data.opted_into_panels}
        updateValue={(value: any) => updateField('opted_into_panels', value)}
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
