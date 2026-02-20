interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  specialties?: string[]; // for judges only
  position?: string; // for hackers only
  is_beginner?: boolean; // for hackers only
  has_checked_in: boolean;
  opted_into_panels?: boolean; // for judges only
}

export default User;
