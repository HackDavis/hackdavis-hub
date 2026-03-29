'use client';

import { getManyTeams } from '@actions/teams/getTeams';
import { useState } from 'react';

export function useTableNumber() {
  const [tableNumber, setTableNumber] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTableNumber = async (teamNumber: string | null) => {
    if (!teamNumber) return;
    setLoading(true);
    const teamsRes = await getManyTeams({ teamNumber });
    if (!teamsRes.ok) {
      setError(teamsRes.error);
    } else {
      // grab first team that matches teamNumber, get tableNumber back
      const tableNumber = teamsRes.body?.[0]?.tableNumber;
      const normalizedTableNumber =
        tableNumber === null || tableNumber === undefined
          ? null
          : String(tableNumber);
      setTableNumber(normalizedTableNumber);
      if (!normalizedTableNumber) {
        setError('No team with given teamNumber');
      } else {
        setError(null);
      }
    }
    setLoading(false);
  };

  return { loading, tableNumber, fetchTableNumber, setTableNumber, error };
}
