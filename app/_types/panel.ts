interface Panel {
  _id?: string;
  track: string;
  domain: string;
  user_ids: string[];
  users?: object[]; // populated by aggregation
}

export default Panel;
