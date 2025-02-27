interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  specialties?: string[];
  position?: string;
  is_beginner?: boolean;
  starter_kit_stage?: number;
}

export default User;
