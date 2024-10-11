export type TaskSearchCriteria = { status: string } | { robotType: string } | { userId: string };

export interface ITaskSearchCriteria {
    status?: string;
    robotType?: string;
    userId?: string;
}