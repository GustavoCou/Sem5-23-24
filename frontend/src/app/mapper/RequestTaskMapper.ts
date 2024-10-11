import { TaskRequestDTO } from "../dto/TaskRequestDTO";
import { requestTaskModel } from "../model/requestTaskModel";

export class RequestTaskMapper {
    public static toTaskModel(requestDTO: TaskRequestDTO): requestTaskModel {

        return {
            id: requestDTO.id,
            requesterUser: requestDTO.requesterUser,
            robot: requestDTO.robot,
            task: requestDTO.task,
            status: requestDTO.status,
            date: requestDTO.date,
        };
    }

    public static toTaskDTO(requestTask: requestTaskModel): TaskRequestDTO {

        return {
            id: requestTask.id ?? '',
            requesterUser: requestTask.requesterUser,
            robot: requestTask.robot,
            task: requestTask.task,
            status: requestTask.status,
            date: requestTask.date,
        };
    }
}
