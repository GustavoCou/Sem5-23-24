import { Container } from 'typedi';
import { Mapper } from "../core/infra/Mapper";
import { IRoomDTO } from "../dto/IRoomDTO";
import { Room } from "../domain/Room/Room";
import { RoomSize } from '../domain/Room/RoomSize';
import { RoomPosition } from '../domain/Room/RoomPosition';
import { RoomDescription } from '../domain/Room/RoomDescription';
import { RoomType } from '../domain/Room/RoomType';
import { RoomId } from "../domain/Room/RoomId";

import FloorRepo from '../repos/floorRepo';


export class RoomMap extends Mapper<Room> {

	public static toDTO(Room: Room): IRoomDTO {
		return {
			roomId: Room.id.toString(),
			description: Room.description,
			size: {
				width: Room.width,
				depth: Room.depth,
			},
			position: {
				posX: Room.posX,
				posY: Room.posY,
			},
			roomType: Room.roomType,
			floor: Room.floor.id.toString()
		} as IRoomDTO;
	}

	public static async toDomain(raw: any): Promise<Room> {
		const RoomDescriptionOrError = RoomDescription.create(raw.description);
		const RoomSizeOrError = RoomSize.create(raw.size.width, raw.size.depth);
		const RoomPositionOrError = RoomPosition.create(raw.position.posX, raw.position.posY);
		const RoomTypeOrError = RoomType.create(raw.roomType)
		const RoomIdOrError = RoomId.create(raw.domainId);

		const repo = Container.get(FloorRepo);
		const RoomFloorOrError = await repo.findById(raw.building);

		const RoomOrError = Room.create({
			description: RoomDescriptionOrError.getValue(),
			size: RoomSizeOrError.getValue(),
			position: RoomPositionOrError.getValue(),
			roomType: RoomTypeOrError.getValue(),
			floor: RoomFloorOrError
		}, RoomIdOrError.getValue())

		RoomOrError.isFailure ? console.log(RoomOrError.error) : '';

		return RoomOrError.isSuccess ? RoomOrError.getValue() : null;
	}

	public static toPersistence(Room: Room): any {
		const roomSchema = {
			domainId: Room.id.toString(),
			description: Room.description,
			size: {
				width: Room.width,
				depth: Room.depth
			},
			position: {
				posX: Room.posX,
				posY: Room.posY
			},
			roomType: Room.roomType,
			floor: Room.floor.id.toString()
		}

		return roomSchema;
	}
}