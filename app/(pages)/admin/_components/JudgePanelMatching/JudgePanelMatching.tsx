'use client';

import assignJudgesToPanels from '@actions/logic/assignJudgesToPanels';
import { deleteManyPanels } from '@actions/panels/deletePanel';
import { getManyPanels } from '@actions/panels/getPanels';
import Panel from '@typeDefs/panel';
import { useState } from 'react';

// TODO: make a nicer admin panel for panels later
export default function JudgePanelMatching() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [panelsDeleted, setPanelsDeleted] = useState<boolean>(false);
  const [panelSize, setPanelSize] = useState<number>(5);

  const handleAssignJudges = async () => {
    setError(null);
    setPanelsDeleted(false);
    const response = await assignJudgesToPanels(panelSize);
    if (!response.ok || !response.body) {
      setPanels([]);
      setError(response.error ?? 'Failed to assign judges to panels');
    }
    setPanels(response.body);
  };

  const handleDeletePanels = async () => {
    setError(null);
    setPanels([]);
    const response = await deleteManyPanels();
    if (!response.ok) {
      setPanelsDeleted(false);
      setError(response.error ?? 'Failed to delete panels');
    } else {
      setPanelsDeleted(true);
    }
  };

  const handleGetPanels = async () => {
    setError(null);
    setPanelsDeleted(false);
    setPanels([]);
    const response = await getManyPanels();
    if (!response.ok) {
      setError(response.error ?? 'Failed to get panels');
    } else if (response.body.length === 0) {
      setError('Panels collection is empty!');
    } else {
      setPanels(response.body);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-start p-16">
      <h1>Assign Judges to Panels</h1>
      <div className="flex gap-4">
        <button
          onClick={() => handleDeletePanels()}
          className="rounded border-2 bg-yellow-400 text-bold p-4"
        >
          Delete All Panels
        </button>
        <button
          onClick={() => handleGetPanels()}
          className="rounded border-2 bg-yellow-400 text-bold p-4"
        >
          Get All Panels
        </button>
      </div>
      <div className="flex gap-4 align-center justify-center">
        <p className="py-4">Panel Size (must be less than 6): </p>
        <input
          type="number"
          value={panelSize}
          onChange={(e) => setPanelSize(parseInt(e.target.value))}
          placeholder="Panel Size"
        ></input>
        <button
          onClick={() => handleAssignJudges()}
          className="rounded border-2 bg-yellow-400 text-bold p-4"
        >
          Assign Judges
        </button>
      </div>
      {error && <p className="text-text-error">{error}</p>}
      {panelsDeleted && <p>!! Deleted all panels RAHHHH !!</p>}
      {panels &&
        panels.map((panel) => (
          <div key={panel._id}>
            <h2>Track: {panel.track}</h2>
            <h4>Domain: {panel.domain}</h4>
            {/* <p>Users: {panel.user_ids.join(', ')}</p> */}
            <div className="flex flex-col">
              Judges:
              {panel.users?.map((user) => (
                <p key={user._id ?? ''}>
                  {`${user.name} - ${user.specialties?.join(', ') ?? ''}`}
                </p>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
