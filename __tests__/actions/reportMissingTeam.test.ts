/** @jest-environment node */

import { auth } from '@/auth';
import { GetManySubmissions } from '@datalib/submissions/getSubmissions';
import { UpdateSubmission } from '@datalib/submissions/updateSubmission';
import { GetTeam } from '@datalib/teams/getTeam';
import { UpdateTeam } from '@datalib/teams/updateTeam';
import {
  reportMissingProject,
  restoreMissingTeam,
} from '@actions/teams/reportMissingTeam';
import Submission from '@typeDefs/submission';

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@datalib/submissions/getSubmissions', () => ({
  GetManySubmissions: jest.fn(),
}));

jest.mock('@datalib/submissions/updateSubmission', () => ({
  UpdateSubmission: jest.fn(),
}));

jest.mock('@datalib/teams/getTeam', () => ({
  GetTeam: jest.fn(),
}));

jest.mock('@datalib/teams/updateTeam', () => ({
  UpdateTeam: jest.fn(),
}));

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockGetManySubmissions = GetManySubmissions as jest.MockedFunction<
  typeof GetManySubmissions
>;
const mockUpdateSubmission = UpdateSubmission as jest.MockedFunction<
  typeof UpdateSubmission
>;
const mockGetTeam = GetTeam as jest.MockedFunction<typeof GetTeam>;
const mockUpdateTeam = UpdateTeam as jest.MockedFunction<typeof UpdateTeam>;

const makeSubmission = (
  judge_id: string,
  team_id: string,
  queuePosition: number,
  is_scored = false
): Submission => ({
  judge_id,
  team_id,
  queuePosition,
  is_scored,
  social_good: null,
  creativity: null,
  presentation: null,
  scores: [],
});

describe('reportMissingTeam flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('reportMissingProject', () => {
    it('pushes a report and moves the reported team to the end of the judge queue', async () => {
      mockUpdateTeam.mockResolvedValue({
        ok: true,
        body: {},
        error: null,
      } as any);
      mockGetManySubmissions.mockResolvedValue({
        ok: true,
        body: [
          makeSubmission('judge-1', 'team-a', 0),
          makeSubmission('judge-1', 'team-b', 1),
          makeSubmission('judge-1', 'team-c', 2),
        ],
        error: null,
      } as any);
      mockUpdateSubmission.mockResolvedValue({
        ok: true,
        body: {},
        error: null,
      } as any);

      const res = await reportMissingProject('judge-1', 'team-b');

      expect(res.ok).toBe(true);
      expect(mockUpdateTeam).toHaveBeenCalledWith('team-b', {
        $push: {
          reports: {
            timestamp: expect.any(Number),
            judge_id: 'judge-1',
          },
        },
      });

      expect(mockUpdateSubmission).toHaveBeenCalledTimes(3);
      expect(mockUpdateSubmission).toHaveBeenNthCalledWith(
        1,
        'judge-1',
        'team-a',
        {
          $set: { queuePosition: 0 },
        }
      );
      expect(mockUpdateSubmission).toHaveBeenNthCalledWith(
        2,
        'judge-1',
        'team-c',
        {
          $set: { queuePosition: 1 },
        }
      );
      expect(mockUpdateSubmission).toHaveBeenNthCalledWith(
        3,
        'judge-1',
        'team-b',
        {
          $set: { queuePosition: 2 },
        }
      );
    });

    it('returns an error when the reported team is not in that judge submission list', async () => {
      mockUpdateTeam.mockResolvedValue({
        ok: true,
        body: {},
        error: null,
      } as any);
      mockGetManySubmissions.mockResolvedValue({
        ok: true,
        body: [makeSubmission('judge-1', 'team-x', 0)],
        error: null,
      } as any);

      const res = await reportMissingProject('judge-1', 'team-b');

      expect(res.ok).toBe(false);
      expect(res.error).toContain(
        'Submission from judge: judge-1 and team: team-b not found.'
      );
      expect(mockUpdateSubmission).not.toHaveBeenCalled();
    });
  });

  describe('restoreMissingTeam', () => {
    it('requeues each unique reporting judge, clears reports, and reactivates inactive team', async () => {
      mockAuth.mockResolvedValue({ user: { role: 'admin' } } as any);
      mockGetTeam.mockResolvedValue({
        ok: true,
        body: {
          _id: 'team-target',
          teamNumber: 5,
          tableNumber: 'A1',
          name: 'Target Team',
          tracks: ['General'],
          active: false,
          reports: [
            { timestamp: 1, judge_id: 'judge-a' },
            { timestamp: 2, judge_id: 'judge-a' },
            { timestamp: 3, judge_id: 'judge-b' },
            { timestamp: 4, judge_id: '' },
          ],
        },
        error: null,
      } as any);

      mockGetManySubmissions
        .mockResolvedValueOnce({
          ok: true,
          body: [
            makeSubmission('judge-a', 'team-x', 0),
            makeSubmission('judge-a', 'team-target', 1),
            makeSubmission('judge-a', 'team-y', 2),
          ],
          error: null,
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          body: [
            makeSubmission('judge-b', 'team-target', 0, true),
            makeSubmission('judge-b', 'team-z', 1),
          ],
          error: null,
        } as any);

      mockUpdateSubmission.mockResolvedValue({
        ok: true,
        body: {},
        error: null,
      } as any);
      mockUpdateTeam.mockResolvedValue({
        ok: true,
        body: {},
        error: null,
      } as any);

      const res = await restoreMissingTeam('team-target');

      expect(res.ok).toBe(true);
      expect(mockGetManySubmissions).toHaveBeenCalledTimes(2);
      expect(mockGetManySubmissions).toHaveBeenNthCalledWith(1, {
        judge_id: { '*convertId': { id: 'judge-a' } },
      });
      expect(mockGetManySubmissions).toHaveBeenNthCalledWith(2, {
        judge_id: { '*convertId': { id: 'judge-b' } },
      });

      // judge-a queue should be reordered, judge-b is skipped because target is already scored
      expect(mockUpdateSubmission).toHaveBeenCalledTimes(3);
      expect(mockUpdateSubmission).toHaveBeenNthCalledWith(
        1,
        'judge-a',
        'team-x',
        {
          $set: { queuePosition: 0 },
        }
      );
      expect(mockUpdateSubmission).toHaveBeenNthCalledWith(
        2,
        'judge-a',
        'team-y',
        {
          $set: { queuePosition: 1 },
        }
      );
      expect(mockUpdateSubmission).toHaveBeenNthCalledWith(
        3,
        'judge-a',
        'team-target',
        {
          $set: { queuePosition: 2 },
        }
      );

      expect(mockUpdateTeam).toHaveBeenCalledWith('team-target', {
        $set: { reports: [], active: true },
      });
      expect(res.body?.requeueResults).toEqual([
        { judge_id: 'judge-a', reorderResCount: 3 },
      ]);
    });

    it('clears reports and keeps the team active when the team is already active', async () => {
      mockAuth.mockResolvedValue({ user: { role: 'admin' } } as any);
      mockGetTeam.mockResolvedValue({
        ok: true,
        body: {
          _id: 'team-target',
          teamNumber: 10,
          tableNumber: 'B2',
          name: 'Already Active Team',
          tracks: ['General'],
          active: true,
          reports: [],
        },
        error: null,
      } as any);
      mockUpdateTeam.mockResolvedValue({
        ok: true,
        body: {},
        error: null,
      } as any);

      const res = await restoreMissingTeam('team-target');

      expect(res.ok).toBe(true);
      expect(mockGetManySubmissions).not.toHaveBeenCalled();
      expect(mockUpdateTeam).toHaveBeenCalledWith('team-target', {
        $set: { reports: [], active: true },
      });
    });

    it('rejects non-admin users', async () => {
      mockAuth.mockResolvedValue({ user: { role: 'judge' } } as any);

      const res = await restoreMissingTeam('team-target');

      expect(res.ok).toBe(false);
      expect(res.error).toBe('Access Denied.');
      expect(mockGetTeam).not.toHaveBeenCalled();
      expect(mockUpdateTeam).not.toHaveBeenCalled();
      expect(mockGetManySubmissions).not.toHaveBeenCalled();
      expect(mockUpdateSubmission).not.toHaveBeenCalled();
    });
  });
});
