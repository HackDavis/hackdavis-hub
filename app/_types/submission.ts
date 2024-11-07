interface SubmissionInt {
  _id: string;
  judge_id: string;
  team_id: string;
  scores: number[];
  correlations: object[];
  comments?: string;
}

export default SubmissionInt;
