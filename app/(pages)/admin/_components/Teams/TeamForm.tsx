'use client';
import Team from '@typeDefs/team';
import styles from './TeamForm.module.scss';
import ShortInput from '../ShortTextInput/ShortInput';
import useFormContext from '@pages/admin/_hooks/useFormContext';
import ListInput from '../ListInput/ListInput';
import { IoTrashOutline } from 'react-icons/io5';
import DropdownInput from '../DropdownInput/DropdownInput';

interface TeamFormProps {
  team?: Team | null;
  cancelAction?: () => void;
}

export default function TeamForm({ cancelAction = () => {} }: TeamFormProps) {
  const { data, updateField } = useFormContext();

  return (
    <form className={styles.container}>
      <ShortInput type="text" label="id" value={data._id ?? ''} disabled />
      <ShortInput
        type="text"
        label="name"
        value={data.name ?? ''}
        onChange={(event) => updateField('name', event.target.value)}
        required
      />
      <ShortInput
        type="number"
        label="team number"
        value={data.teamNumber ?? ''}
        onChange={(event) => updateField('teamNumber', event.target.value)}
        required
      />
      <ShortInput
        type="number"
        label="table number"
        value={data.tableNumber ?? ''}
        onChange={(event) => updateField('tableNumber', event.target.value)}
        required
      />
      <ListInput
        label="tracks"
        value={data.tracks}
        onUpdate={(value: any) => updateField('tracks', value)}
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
      />
      <DropdownInput
        label="active"
        value={data.active}
        onUpdate={(value: any) => updateField('active', value)}
        width="400px"
        options={[
          { option: 'true', value: true },
          { option: 'false', value: false },
        ]}
      />
      <div className={styles.action_buttons}>
        <button
          className={styles.submit_button}
          type="submit"
          onClick={() => {
            console.log(data);
          }}
        >
          Submit
        </button>
        <button className={styles.cancel_button} onClick={cancelAction}>
          Cancel
        </button>
      </div>
    </form>
  );
}
