'use client';
import styles from './AnnouncementForm.module.scss';
import useFormContext from '@pages/admin/_hooks/useFormContext';

import ShortInput from '../ShortInput/ShortInput';

import { createAnnouncement } from '@actions/announcements/createAnnouncement';
import { updateAnnouncement } from '@actions/announcements/updateAnnouncement';
import { HttpError } from '@utils/response/Errors';
import DateTimeInput from '../DateTimeInput/DateTimeInput';

interface AnnouncementFormProps {
  cancelAction?: () => void;
  revalidate?: () => void;
}

export default function AnnouncementForm({
  cancelAction = () => {},
  revalidate = () => {},
}: AnnouncementFormProps) {
  const { data, updateField, setData } = useFormContext();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const verificationList = [
        {
          field: 'title',
          validation: (title: any) => title?.length > 0,
        },
        {
          field: 'description',
          validation: (title: any) => title?.length > 0,
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

    const { _id, ...body } = data;

    let announcement_id = _id;
    if (!announcement_id) {
      const createRes = await createAnnouncement(body);
      if (!createRes.ok) {
        throw new Error(createRes?.error ?? '');
      }
      announcement_id = createRes.body?._id;
    }

    const res = await updateAnnouncement(announcement_id, { $set: body });

    if (res.ok) {
      setData({});
      revalidate();
    } else {
      alert(res.error);
    }
  };

  const convertDate = (date: number): string => {
    try {
      const d = new Date(date);
      return d.toISOString().substring(0, 16);
    } catch (e) {
      return '';
    }
  };

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <ShortInput type="text" label="id" value={data._id ?? ''} disabled />
      <ShortInput
        type="text"
        label="title"
        value={data.title ?? ''}
        updateValue={(newTitle) => updateField('title', newTitle)}
        required
      />
      <ShortInput
        type="text"
        label="description"
        value={data.description ?? ''}
        updateValue={(newDescription) =>
          updateField('description', newDescription)
        }
        required
      />
      <DateTimeInput label="time" value={convertDate(Date.now())} required />

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
