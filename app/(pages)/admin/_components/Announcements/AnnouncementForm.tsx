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

    if (!_id) {
      if (!body.time) body.time = new Date(Date.now());
      const createRes = await createAnnouncement(body);
      if (createRes.ok) {
        setData({});
        revalidate();
      } else {
        alert(createRes.error);
      }
    } else {
      if (body.time) body.time = new Date(body.time);
      const updateRes = await updateAnnouncement(_id, { $set: body });
      if (updateRes.ok) {
        setData({});
        revalidate();
      } else {
        alert(updateRes.error);
      }
    }
  };

  const timeDate = formatDate(data.time ?? Date.now());

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
      <DateTimeInput label="time" value={timeDate} required disabled />

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
