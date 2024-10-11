
import { Mapper } from "../core/infra/Mapper";
import  IBuildingDTO  from "../dto/IBuildingDTO";
import { Building } from "../domain/Building/Building";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { BuildingSize } from '../domain/Building/BuildingSize';
import { BuildingId } from "../domain/Building/BuildingId";
import { BuildingName } from "../domain/Building/BuildingName";
import { BuildingDescription } from "../domain/Building/BuildingDescription";


export class BuildingMap extends Mapper<Building> {

  public static toDTO(building: Building): IBuildingDTO {

    return {

      id: building.id.toString(),
      name: building.name,
      description: building.description,
      width: building.width,
      depth: building.depth,
    } as IBuildingDTO;
  }

  public static async toDomain(raw: any): Promise<Building> {
    const buildingName = BuildingName.create(raw.name);
    const buildingDescription = BuildingDescription.create(raw.description);
    const buildingSizeOrError = BuildingSize.create(raw.width, raw.depth);
    const buildingId = BuildingId.create(raw.domainId).getValue();

    const buildingOrError = Building.create({
      name: buildingName.getValue(),
      description:buildingDescription.getValue(),
      size: buildingSizeOrError.getValue()
    }, buildingId)

    buildingOrError.isFailure ? console.log(buildingOrError.error) : '';

    return buildingOrError.isSuccess ? buildingOrError.getValue() : null;
  }

  public static toPersistence(building: Building): any {
    const a = {
      domainId: building.id.toString(),
      name: building.name,
      description: building.description,
      width: building.width,
      depth: building.depth,
    }
    return a;
  }
}