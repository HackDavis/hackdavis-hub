'use client';
import ingestCSV from '@actions/logic/ingestCSV';
import React, { useState } from 'react';

export default function CsvIngestion() {
  const [pending, setPending] = useState(false);
  const [response, setResponse] = useState('');

  const handler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const res = await ingestCSV(formData);
    setResponse(JSON.stringify(res));
    setPending(false);
  };

  return (
    <div>
      <div>
        <h4>Upload CSV:</h4>
        <form
          onSubmit={handler}
          className="tw-flex tw-flex-col tw-py-4 tw-gap-2"
        >
          <input type="file" accept=".csv" name="file" id="file" />
          <button type="submit">Upload</button>
        </form>
        <p>{pending ? 'parsing CSV and creating teams...' : response}</p>
      </div>
    </div>
  );
}
