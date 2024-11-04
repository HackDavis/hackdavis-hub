interface JudgeInt {
  _id?: string;
  name: string;
  email: string;
  password: string;
  specialty: string;
  role: string;
  judge_group_id?: string;
  submission_ids?: string[];
}

export default JudgeInt;
