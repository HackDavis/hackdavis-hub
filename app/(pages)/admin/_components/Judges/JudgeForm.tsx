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
import { updateUser } from '@actions/users/updateUser';
import { createSubmission } from '@actions/submissions/createSubmission';
import updateSubmission from '@actions/submissions/updateSubmission';
import Team from '@typeDefs/team';
import HttpError from '@utils/response/HttpError';
import { getManySubmissions } from '@actions/submissions/getSubmission';
import { deleteSubmission } from '@actions/submissions/deleteSubmission';
import Submission from '@typeDefs/submission';

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

  if (data?._id) {
    data.teams = data.teams.map((team: any) => {
      return teamMap[team._id];
    });
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let dataIsValid;

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
          field: 'has_checked_in',
          validation: (has_checked_in: any) =>
            has_checked_in === true || has_checked_in === false,
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

    const { _id, name, email, role, specialties, teams, has_checked_in } = data;
    const body = {
      name,
      email,
      role,
      specialties,
      has_checked_in,
    };

    const updateJudgeWithTeams = async (
      judge_id: string,
      body: any,
      teams: Team[]
    ) => {
      try {
        const updateRes = await updateUser(judge_id, body);
        if (!updateRes.ok) {
          throw new Error(updateRes.error ?? '');
        }

        const judgeSubmissions = await getManySubmissions({
          judge_id: {
            '*convertId': {
              id: judge_id,
            },
          },
        });

        if (!judgeSubmissions.ok) {
          throw new Error(judgeSubmissions?.error);
        }

        const currentJudgeTeams: string[] = judgeSubmissions.body.map(
          (submission: Submission) => submission.team_id
        );

        const newJudgeTeams = teams.map((team: Team) => team._id ?? '');

        const teamOrderMap = Object.fromEntries(
          teams.map((team: Team, index: number) => [team._id, index])
        );

        const updateList = newJudgeTeams.filter((id: string) =>
          currentJudgeTeams.includes(id)
        );

        const deleteList = currentJudgeTeams.filter(
          (id: string) => !newJudgeTeams.includes(id)
        );

        const createList = newJudgeTeams.filter(
          (id: string) => !currentJudgeTeams.includes(id)
        );

        const updateSubmissionsResList = await Promise.all(
          updateList.map((team_id) =>
            updateSubmission(_id, team_id, {
              queuePosition: teamOrderMap[team_id],
            })
          )
        );

        if (!updateSubmissionsResList.every((res: any) => res.ok)) {
          throw new Error(
            'Some updates failed: \n' + JSON.stringify(updateSubmissionsResList)
          );
        }

        const createSubmissionsResList = await Promise.all(
          createList.map((team_id) =>
            createSubmission({
              judge_id: {
                '*convertId': {
                  id: judge_id,
                },
              },
              team_id: {
                '*convertId': {
                  id: team_id,
                },
              },
              queuePosition: teamOrderMap[team_id],
            })
          )
        );

        if (!createSubmissionsResList.every((res: any) => res.ok)) {
          throw new Error(
            'Some creates failed: \n' + JSON.stringify(createSubmissionsResList)
          );
        }

        const deleteSubmissionResList = await Promise.all(
          deleteList.map((team_id) => deleteSubmission(_id, team_id))
        );

        if (!deleteSubmissionResList.every((res: any) => res.ok)) {
          throw new Error(
            'Some deletes failed: \n' + JSON.stringify(deleteSubmissionResList)
          );
        }

        return {
          ok: true,
          body: {
            updateRes,
            updateSubmissionsResList,
            createSubmissionsResList,
            deleteSubmissionResList,
          },
          error: null,
        };
      } catch (e) {
        const error = e as HttpError;
        return { ok: false, body: null, error: error.message };
      }
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
              <TeamCard team={item} editable={false} />
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
