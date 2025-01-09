export interface QuestsModel {
  id: number;
  name: string;
  description: string;
  url: string | null;
  begin_date: Date | null;
  end_date: Date | null;
  reward_value: number;
  currency: string;
  progress: number;
  completed: boolean;
}
