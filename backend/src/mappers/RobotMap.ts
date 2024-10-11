
import { Mapper } from "../core/infra/Mapper";
import IRobotDTO from "../dto/IRobotDTO";
import { Robot } from "../domain/Robot/Robot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { RobotId } from "../domain/Robot/RobotId";
import { RobotSerialNumber } from "../domain/Robot/RobotSerialNumber";
import { NickName } from "../domain/Robot/NickName";
import { RobotTypeId } from "../domain/RobotType/RobotTypeId";
import { RobotDescription } from "../domain/Robot/RobotDescription";


export class RobotMap extends Mapper<Robot> {

  public static toDTO(robot: Robot): IRobotDTO {

    return {

      id: robot.id.toString(),
      serialNumber: robot.serialNumber,
      nickName: robot.nickName,
      description: robot.description,
      robotTypeId: robot.robotTypeId.toString(),
      inhibited: robot.inhibited,

    } as IRobotDTO;
  }

  public static async toDomain(raw: any): Promise<Robot> {
    const robotId = RobotId.create(raw.domainId).getValue();
    const serialNumber = RobotSerialNumber.create(raw.serialNumber);
    const nickName = NickName.create(raw.nickName);
    const description = RobotDescription.create(raw.description);
    const robotTypeId = RobotTypeId.create(raw.robotTypeId);

    const inhibited = raw.inhibited;




    const robotOrError = Robot.create({
      serialNumber: serialNumber.getValue(),
      nickName: nickName.getValue(),
      description: description.getValue(),
      robotTypeId: robotTypeId.getValue(),
      inhibited: inhibited
    }, robotId)

    robotOrError.isFailure ? console.log(robotOrError.error) : '';

    return robotOrError.isSuccess ? robotOrError.getValue() : null;
  }

  public static toPersistence(robot: Robot): any {
    const a = {
      domainId: robot.id.toString(),
      serialNumber: robot.serialNumber,
      nickName: robot.nickName,
      description: robot.description,
      robotTypeId: robot.robotTypeId.toString(),
      inhibited: robot.inhibited,

    }
    return a;
  }
}