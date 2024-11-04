'use client';
import ingestCSV from '@actions/logic/ingestCSV';
import React, { useState } from 'react';
import uploadFile from '@actions/logic/uploadFile';
import styles from './csv.module.scss';

export default function CsvIngestion() {
  const [pending, setPending] = useState(false);
  const [response, setResponse] = useState('');
  const [uploadRes, setUploadRes] = useState('');

  const handler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fileRes = await uploadFile(formData);
    setUploadRes(JSON.stringify(fileRes.ok));

    if (fileRes.ok && fileRes.body) {
      setPending(true);
      const res = await ingestCSV(fileRes.body);
      setResponse(JSON.stringify(res));
      setPending(false);
    }
  };

  return (
    <div>
      <div>
        <h4>Upload CSV:</h4>
        <form onSubmit={handler} className={styles.form}>
          <input type="file" accept=".csv" name="file" id="file" />
          <button type="submit">Upload</button>
          <p>Upload Successful: {uploadRes}</p>
        </form>
        <p>{pending ? 'creating teams...' : response}</p>
      </div>
    </div>
  );
}
