interface Team {
  _id?: string;
  teamNumber: number;
  tableNumber: number;
  name: string;
  tracks: string[];
  active: boolean;
}

export default Team;
