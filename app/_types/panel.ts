import User from "./user";

interface Panel {
  _id?: string;
  track: string;
  domain: string;
  user_ids: string[];
  users?: User[]; // populated by aggregation
}

export default Panel;
