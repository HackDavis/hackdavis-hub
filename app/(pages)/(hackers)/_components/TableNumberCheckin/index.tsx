'use client';

import { useState } from 'react';
import { useTableNumber } from '@pages/_hooks/useTableNumber';
import useTableNumberContext from '@pages/_hooks/useTableNumberContext';

import InitStage from './InitStage';
import DevpostStage from './DevpostStage';
import LoadingStage from './LoadingStage';
import ConfirmStage from './ConfirmStage';

export default function TableNumberCheckin() {
  const {
    loading: localStorageLoading,
    storedValue,
    setValue,
  } = useTableNumberContext();

  const [teamNumber, setTeamNumber] = useState('');
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const { loading, tableNumber, fetchTableNumber, setTableNumber, error } =
    useTableNumber();

  if (localStorageLoading || storedValue) {
    return null;
  }

  // Stage resolution
  let stage: 'init' | 'devpost' | 'loading' | 'confirm' = 'init';
  if (loading) {
    stage = 'loading';
  } else if (tableNumber) {
    stage = 'confirm';
  } else if (hasClickedNext) {
    stage = 'devpost';
  }

  const handleTeamNumberSubmit = () => {
    fetchTableNumber(Number(teamNumber));
  };

  const handleReset = () => {
    setTableNumber(null);
    setTeamNumber('');
    setHasClickedNext(false);
  };

  console.log({ loading, tableNumber, hasClickedNext, stage });

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center px-[15px] z-[101]">
      <div className="w-full">
        {stage === 'init' && (
          <InitStage onNext={() => setHasClickedNext(true)} />
        )}
        {stage === 'devpost' && (
          <DevpostStage
            teamNumber={teamNumber}
            error={error}
            onChange={setTeamNumber}
            onSubmit={handleTeamNumberSubmit}
            onBack={() => setHasClickedNext(false)}
          />
        )}
        {stage === 'loading' && <LoadingStage teamNumber={teamNumber} />}
        {stage === 'confirm' && (
          <ConfirmStage
            tableNumber={tableNumber}
            onConfirm={() => setValue(tableNumber)}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
