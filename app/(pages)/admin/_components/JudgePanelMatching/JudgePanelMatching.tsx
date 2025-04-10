'use client';

import assignJudgesToPanels from '@actions/logic/assignJudgesToPanels';
import { deletePanels } from '@actions/panels/deletePanel';
import { getAllPanels } from '@actions/panels/getPanels';
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
    const response = await deletePanels();
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
    const response = await getAllPanels();
    if (!response.ok) {
      setPanels([]);
      setError(response.error ?? 'Failed to delete panels');
    } else {
      setPanels(response.body);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-start p-16">
      <h1>Assign Judges to Panels</h1>
      <button onClick={() => handleDeletePanels()}>Delete All Panels</button>
      <button onClick={() => handleGetPanels()}>Get All Panels</button>
      <div className="flex gap-4">
        <input
          type="number"
          value={panelSize}
          onChange={(e) => setPanelSize(parseInt(e.target.value))}
          placeholder="Panel Size"
        ></input>
        <button onClick={() => handleAssignJudges()}>Assign Judges</button>
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
