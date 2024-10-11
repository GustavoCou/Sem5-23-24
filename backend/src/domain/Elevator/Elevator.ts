
import { ElevatorId } from "./ElevatorId"
import { ElevatorPosition } from "./ElevatorPosition"
import IElevatorDTO from "../../dto/IElevatorDTO"
import { Result } from "../../core/logic/Result"
import { AggregateRoot } from "../../core/domain/AggregateRoot"
import { BuildingId } from "../Building/BuildingId";
import { ElevatorDescription } from "./ElevatorDescription"
import { ElevatorModel } from "./ElevatorModel"

import { ElevatorSerialNumber } from "./ElevatorSerialNumber"
import { ElevatorBrand } from "./ElevatorBrand"
import { FloorID } from "../Floor/FloorID"
import { number } from "joi"



interface ElevatorProps {
  buildingId: BuildingId;
  elevatorPosition: ElevatorPosition;
  elevatorId: ElevatorId;
  floorIds: FloorID[];
  elevatorUniqueCodBuilding: number;
  elevatorBrand: ElevatorBrand; //opcional 50carac
  elevatorModel: ElevatorModel; //opcional, mas obrigatório se marca for introduzido, alfanumerico, 50 caracteres
  elevatorSerialNumber: ElevatorSerialNumber; //opcional, alfanumerico, 50 caracteres
  elevatorDescription: ElevatorDescription //opcional, alfanumerico, 250 caracteres
}

export class Elevator extends AggregateRoot<ElevatorProps>{

  //set buildingId(value: BuildingId) {
  //this.props.buildingId = value;
  //}

  get buildingId(): BuildingId {
    return this.props.buildingId;
  }

  get elevatorPosition(): ElevatorPosition {
    return this.props.elevatorPosition;
  }

  // set elevatorPosition(value: ElevatorPosition) {
  //   this.props.elevatorPosition = value;
  // }

  get elevatorId(): ElevatorId {
    return this.props.elevatorId;
  }

  //set elevatorId(value: ElevatorId) {
  //this.props.elevatorId = value;
  //}

  get elevatorBrand(): ElevatorBrand {
    return this.props.elevatorBrand;
  }

  // set elevatorBrand(value: ElevatorBrand) {
  //   this.props.elevatorBrand = value;
  // }


  get elevatorUniqueCodBuilding(): number {
    return this.props.elevatorUniqueCodBuilding;
  }

  // set elevatorUniqueCodBuilding(value: number) {
  //   this.props.elevatorUniqueCodBuilding = value;
  // }


  get elevatorModel(): ElevatorModel {
    return this.props.elevatorModel;
  }

  // set elevatorModel(value: ElevatorModel) {
  //   this.props.elevatorModel = value;
  // }

  get elevatorSerialNumber(): ElevatorSerialNumber {
    return this.props.elevatorSerialNumber;
  }

  // set elevatorSerialNumber(value: ElevatorSerialNumber) {
  //   this.props.elevatorSerialNumber = value;
  // }

  get elevatorDescription(): ElevatorDescription {
    return this.props.elevatorDescription;
  }

  // set elevatorDescription(value: ElevatorDescription) {
  //   this.props.elevatorDescription = value;
  // }


  get floorIds(): FloorID[] {
    return this.props.floorIds;
  }

  // set floorIds(value: FloorID[]) {
  //   this.props.floorIds = value;
  // }


  private constructor(props: ElevatorProps) {
    super(props);
  }

  public static create(elevatorDTO: IElevatorDTO): Result<Elevator> {

    if ((elevatorDTO.elevatorBrand !== null && elevatorDTO.elevatorBrand !== undefined) &&
      (elevatorDTO.elevatorModel == null || elevatorDTO.elevatorModel == undefined || elevatorDTO.elevatorModel.length === 0)) {

      return Result.fail<Elevator>("The model of the brand is needed.");
    }



    const elevatorPositionResult = ElevatorPosition.create({
      posX: elevatorDTO.elevatorPosition.posX,
      posY: elevatorDTO.elevatorPosition.posY
    });
    if (!elevatorPositionResult.isSuccess) {
      return Result.fail<Elevator>("Elevator Position invalid.");
    }



    const buildingIdResult = BuildingId.create(elevatorDTO.buildingId);
    if (!buildingIdResult.isSuccess) {
      return Result.fail<Elevator>("Building insert not valid");
    }

    const elevatorBrandResult = ElevatorBrand.create(elevatorDTO.elevatorBrand);
    if (!elevatorBrandResult.isSuccess) {
      return Result.fail<Elevator>("Elevator Brand invalid");
    }

    const elevatorModelResult = ElevatorModel.create(elevatorDTO.elevatorModel);
    if (!elevatorModelResult.isSuccess) {
      return Result.fail<Elevator>("Elevator model invalid.");
    }

    const elevatorSerialNumberResult = ElevatorSerialNumber.create(elevatorDTO.elevatorSerialNumber);
    if (!elevatorSerialNumberResult.isSuccess) {
      return Result.fail<Elevator>("Elevator serial number invalid.");
    }

    const elevatorDescriptionResult = ElevatorDescription.create(elevatorDTO.elevatorDescription);
    if (!elevatorDescriptionResult.isSuccess) {
      return Result.fail<Elevator>("Elevator description invalid.");
    }

    const floorIdsResults = elevatorDTO.floorIds.map(id => FloorID.create(id));

    const failedBuildingId = floorIdsResults.find(result => !result.isSuccess);

    if (failedBuildingId) {
      return Result.fail<Elevator>("Invalid floor id. Floor does not exist");
    }

    const floorId = floorIdsResults.map(result => result.getValue());


    const elevatorIdResult = ElevatorId.create(elevatorDTO.elevatorId);
    if (!elevatorIdResult.isSuccess) {
      return Result.fail<Elevator>("Invalid Id");
    }

    const elevator = new Elevator({
      floorIds: floorId,
      elevatorPosition: elevatorPositionResult.getValue(),
      elevatorUniqueCodBuilding: elevatorDTO.elevatorUniqueCodBuilding,
      elevatorId: elevatorIdResult.getValue(),
      buildingId: buildingIdResult.getValue(),
      elevatorBrand: elevatorBrandResult.getValue(),
      elevatorModel: elevatorModelResult.getValue(),
      elevatorSerialNumber: elevatorSerialNumberResult.getValue(),
      elevatorDescription: elevatorDescriptionResult.getValue()
    });

    return Result.ok<Elevator>(elevator);
  }
}