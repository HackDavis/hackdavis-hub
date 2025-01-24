<<<<<<< HEAD
interface JudgeInt {
=======
interface User {
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c
  _id?: string;
  name: string;
  email: string;
  password: string;
<<<<<<< HEAD
  specialty: string;
  role: string;
  judge_group_id?: string;
  submission_ids?: string[]; //change to score_id?
}

export default JudgeInt;
=======
  role: string;
  specialties?: string[];
  position?: string;
  is_beginner?: boolean;
  starter_kit_stage?: number;
}

export default User;
>>>>>>> 95b4e4b5adb199a409d29786cc4d53cbe5e0ba0c
