interface Rollout {
  _id?: string;
  component_key: string;
  rollout_time: number;
  rollback_time?: number;
}

export default Rollout;
