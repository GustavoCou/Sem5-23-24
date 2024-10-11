
export interface TaskRequestDTO {
  id: string
  requesterUser: string;
  robot: string;
  task: string;
  status: string;
  date: Date;
}
