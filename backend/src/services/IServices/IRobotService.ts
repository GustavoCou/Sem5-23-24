import { Result } from "../../core/logic/Result";
import IRobotDTO from "../../dto/IRobotDTO";

export default interface IRobotService {
    CreateRobot(RobotDTO: IRobotDTO): Promise<Result<IRobotDTO>>;
    ListRobot(): Promise<Result<IRobotDTO[]>>;
    updateRobot(RobotDTO: IRobotDTO): Promise<Result<IRobotDTO>>;
    updateInhibitedStatus(RobotDTO: IRobotDTO): Promise<Result<Boolean>>;
    existRobot(robotIdNickName: string): Promise<Result<boolean>>
}