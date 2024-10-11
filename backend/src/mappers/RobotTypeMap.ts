
import { Mapper } from "../core/infra/Mapper";
import { IRobotTypeDTO } from "../dto/IRobotTypeDTO";
import { RobotType } from "../domain/RobotType/RobotType";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { RobotTypeModel } from '../domain/RobotType/RobotTypeModel';
import { RobotTypeId } from "../domain/RobotType/RobotTypeId";
import { RobotTypeBrand } from "../domain/RobotType/RobotTypeBrand";
import { RobotTypeTasks } from "../domain/RobotType/RobotTypeTasks";


export class RobotTypeMap extends Mapper<RobotType> {

  public static toDTO(robotType: RobotType): IRobotTypeDTO {
    return {
      id: robotType.id.toString(),
      robotModel: robotType.model,
      brand: robotType.brand,
      tasks: robotType.tasks  
    } as IRobotTypeDTO;
  }

  public static async toDomain(raw: any): Promise<RobotType> {
    const robotTypeModel = RobotTypeModel.create(raw.model);
    const robotTypeBrand = RobotTypeBrand.create( raw.brand);
    const robotTypeTasks = RobotTypeTasks.create(raw.tasks);
    const robotTypeId = RobotTypeId.create(raw.domainId).getValue();

    const robotTypeOrError = RobotType.create({
      robotModel: robotTypeModel.getValue(),
      brand: robotTypeBrand.getValue(),
      tasks: robotTypeTasks.getValue(),
    }, robotTypeId)

    robotTypeOrError.isFailure ? console.log(robotTypeOrError.error) : '';

    return robotTypeOrError.isSuccess ? robotTypeOrError.getValue() : null;
  }

  public static toPersistence(robotType: RobotType): any {
    const a = {
      domainId: robotType.id.toString(),
      model: robotType.model,
      brand: robotType.brand,
      tasks: robotType.tasks,
    }
    return a;
  }
}