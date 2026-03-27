interface Team {
  _id?: string;
  teamNumber: number;
  tableNumber: string;
  name: string;
  tracks: string[];
  reports: {
    timestamp: number;
    judge_id: string;
  }[];
  active: boolean;
}

export default Team;
