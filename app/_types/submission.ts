export interface Scores {
  social_good: number;
  creativity: number;
  presentation: number;
  comments: string;
  [key: string]: number | string | number[];
}

export default interface Submission {
  _id: string;
  judge_id: string;
  team_id: string;
  scores: Scores;
  is_scored: boolean;
}
