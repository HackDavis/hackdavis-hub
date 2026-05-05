'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isDelayingLookup, setIsDelayingLookup] = useState(false);
  const lookupDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { loading, tableNumber, fetchTableNumber, setTableNumber, error } =
    useTableNumber();

  useEffect(() => {
    return () => {
      if (lookupDelayTimeoutRef.current) {
        clearTimeout(lookupDelayTimeoutRef.current);
      }
    };
  }, []);

  if (localStorageLoading || storedValue !== null) {
    return null;
  }

  // Stage resolution
  let stage: 'init' | 'devpost' | 'loading' | 'confirm' = 'init';
  if (isDelayingLookup || loading) {
    stage = 'loading';
  } else if (tableNumber) {
    stage = 'confirm';
  } else if (hasClickedNext) {
    stage = 'devpost';
  }

  const handleTeamNumberSubmit = () => {
    if (isDelayingLookup || loading) return;

    setIsDelayingLookup(true);
    if (lookupDelayTimeoutRef.current) {
      clearTimeout(lookupDelayTimeoutRef.current);
    }

    lookupDelayTimeoutRef.current = setTimeout(() => {
      void (async () => {
        try {
          await fetchTableNumber(Number(teamNumber));
        } catch {
          // avoid unhandled rejections
        } finally {
          setIsDelayingLookup(false);
          lookupDelayTimeoutRef.current = null;
        }
      })();
    }, 1000);
  };

  const handleReset = () => {
    if (lookupDelayTimeoutRef.current) {
      clearTimeout(lookupDelayTimeoutRef.current);
      lookupDelayTimeoutRef.current = null;
    }
    setIsDelayingLookup(false);
    setTableNumber(null);
    setTeamNumber('');
    setHasClickedNext(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center px-[15px] z-[101] md:px-[6%]">
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
        {stage === 'confirm' && tableNumber && (
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
