interface ScoreInt {
  _id: string;
  judge_id: string;
  team_id: string;
  scores: number[];
  is_scored: boolean;
}

export default ScoreInt;
