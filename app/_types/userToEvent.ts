import Event from './event';
interface UserToEvent {
  _id?: string;
  user_id: string;
  event_id: string;
  event?: Event; // populated by aggregation
}

export default UserToEvent;
