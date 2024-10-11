export interface requestTaskModel {
    id?: string
    requesterUser: string;
    robot: string;
    task: string;
    status: string;
    date: Date;
}