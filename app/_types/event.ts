interface EventInt {
  _id: string;
  name: string;
  host?: string;
  type: string;
  location: string;
  star_time: Date;
  end_time: Date;
  tags?: string[];
}

export default EventInt;
