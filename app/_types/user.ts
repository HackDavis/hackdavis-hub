interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  specialties?: string[];
  position?: string;
  is_beginner?: boolean;
  has_checked_in: boolean;
}

export default User;
