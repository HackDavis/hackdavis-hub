interface AuthToken {
  _id: string;
  name: string;
  email: string;
  password: string;
  specialty: string;
  judge_group_id: string;
  role: string;
  iat: number;
  exp: number;
}

export default AuthToken;
