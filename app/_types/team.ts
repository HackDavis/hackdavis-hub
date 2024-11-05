interface TeamInt {
  _id: string;
  number: number;
  name: string;
  tracks: string[];
  hacker_ids: string[];
  created_at: Date; //is this type correct?
}

export default TeamInt;
