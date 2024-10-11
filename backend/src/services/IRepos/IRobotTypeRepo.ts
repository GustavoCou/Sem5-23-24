import { Repo } from "../../core/infra/Repo";
import { RobotType } from "../../domain/RobotType/RobotType";
import { RobotTypeId } from "../../domain/RobotType/RobotTypeId";


export default interface IRobotTypeRepo extends Repo<RobotType> {
    save(robotType: RobotType): Promise<RobotType>;
    findById (robotTypeId: RobotTypeId | string): Promise<RobotType>;  
    listAll(): Promise<RobotType[]>
    updateOne (robotType: RobotType ): Promise<RobotType>; 
  }