import { Container } from 'typedi';

import { Mapper } from "../core/infra/Mapper";

import { IFloorDTO } from "../dto/IFloorDTO";

import { Floor } from "../domain/Floor/Floor";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { FloorDescription } from "../domain/Floor/FloorDescription";
import { FloorSize } from "../domain/Floor/FloorSize";
import { FloorID } from '../domain/Floor/FloorID';
import BuildingRepo from '../repos/buildingRepo';
import { FloorMapa } from '../domain/Floor/FloorMapa';
import { Domain } from 'domain';
import { IFloorPersistence } from '../dataschema/IFloorPersistence';

export class FloorMap extends Mapper<Floor> {

  public static toDTO(floor: Floor): IFloorDTO {
    return {
      id: floor.id.toString(),
      floorDescription: floor.floorDescription.value,
      floorSize: {
        width: floor.floorSize.width,
        depth: floor.floorSize.depth,
      },
      floorMapa: {
        maze: floor.floorMapa.maze,
        ground: floor.floorMapa.ground,
        wall: floor.floorMapa.wall,
        player: floor.floorMapa.player,
      },
      building: floor.building.id.toString()
    } as IFloorDTO;
  }

  public static async toDomain(raw: any): Promise<Floor> {
    const floorDescriptionOrError = FloorDescription.create(raw.floorDescription);
    const floorSizeOrError = FloorSize.create(raw.floorSize.width, raw.floorSize.depth);
    const repo = Container.get(BuildingRepo);
    const building = await repo.findById(raw.building);
    const floorId = FloorID.create(raw.domainId).getValue();

    const floorMapa = new FloorMapa({
      maze: raw.floorMapa.maze,
      ground: raw.floorMapa.ground,
      wall: raw.floorMapa.wall,
      player: raw.floorMapa.player,
    });

    const floorOrError = Floor.create({
      floorDescription: floorDescriptionOrError.getValue(),
      floorSize: floorSizeOrError.getValue(),
      floorMapa: floorMapa,
      building: building,
    }, floorId);

    floorOrError.isFailure ? console.log(floorOrError.error) : '';

    return floorOrError.isSuccess ? floorOrError.getValue() : null;
  }

  public static toPersistence(floor: Floor): Omit<IFloorPersistence, 'domainId'> & { domainId: string } {
    const a = {
      domainId: floor.id.toString(),
      floorDescription: floor.floorDescription.value,
      floorSize: {
        width: floor.floorSize.width,
        depth: floor.floorSize.depth,
      },
      floorMapa: {
        maze: floor.floorMapa.maze,
        ground: floor.floorMapa.ground,
        wall: floor.floorMapa.wall,
        player: floor.floorMapa.player,
      },
      building: floor.building.id.toValue(),
    }
    return a as Omit<IFloorPersistence, 'domainId'> & { domainId: string };
  }
}