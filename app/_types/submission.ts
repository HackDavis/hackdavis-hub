export interface TrackScore {
  trackName: string,
  rawScores: number[],
  finalTrackScore: number | null
}

export default interface Submission {
  _id?: string;
  judge_id: string;
  team_id: string;
  social_good: number;
  creativity: number;
  presentation: number;
  scores: TrackScore[];
  comments?: string;
  is_scored: boolean;
  queuePosition: number;
}
