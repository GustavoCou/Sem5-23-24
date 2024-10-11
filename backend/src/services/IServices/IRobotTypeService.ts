import { Result } from "../../core/logic/Result";
import { IRobotTypeDTO } from "../../dto/IRobotTypeDTO";

export default interface IRobotTypeService {
    createRobotType(RobotTypeDTO: IRobotTypeDTO): Promise<Result<IRobotTypeDTO>>;
    ListRobotType(): Promise<Result<{ robotTypeDTO: IRobotTypeDTO[] }>>;
    updateRobotType(RobotTypeDTO: IRobotTypeDTO): Promise<Result<{ robotTypeDTO: IRobotTypeDTO }>>
}