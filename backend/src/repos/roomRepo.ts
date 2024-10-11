import { Service, Inject } from 'typedi';
import IRoomRepo from "../services/IRepos/IRoomRepo";
import { Room } from "../domain/Room/Room";
import { RoomId } from "../domain/Room/RoomId";
import { RoomMap } from "../mappers/RoomMap";
import { Document, FilterQuery, Model } from 'mongoose';
import { IRoomPersistence } from '../dataschema/IRoomPersistence';


@Service()
export default class RoomRepo implements IRoomRepo {

	private models: any;

	constructor(
		@Inject('roomSchema') private roomSchema: Model<IRoomPersistence & Document>
	) { }

	private createBaseQuery(): any {
		return {
			where: {},
		}
	}

	public async exists(room: Room | string): Promise<boolean> {
		const idX = room instanceof RoomId ? (<RoomId>room).id.toValue() : room;
		const query = { domainId: idX };
		const roomDocument = await this.roomSchema.findOne(query);

		return !!roomDocument === true;
	}

	public async save(room: Room): Promise<Room> {
		const query = { domainId: room.id.toString() };
		const roomDocument = await this.roomSchema.findOne(query);

		try {
			if (roomDocument === null) {
				const rawRoom: any = RoomMap.toPersistence(room);
				const roomCreated = await this.roomSchema.create(rawRoom);

				return RoomMap.toDomain(roomCreated);
			}
			else {
				roomDocument.description = room.description;
				roomDocument.size.width = room.width;
				roomDocument.size.depth = room.depth;
				roomDocument.position.posX = room.posX;
				roomDocument.position.posY = room.posY;
				roomDocument.roomType = room.roomType;
				roomDocument.floor = room.floor.id.toString();

				await roomDocument.save();

				return room;
			}
		}
		catch (err) {
			throw err;
		}
	}

	public async findById(roomId: RoomId | string): Promise<Room> {
		const idX = roomId instanceof RoomId ? (<RoomId>roomId).id.toValue() : roomId;
		const query = { domainId: idX };
		const roomRecord = await this.roomSchema.findOne(query);

		if (roomRecord != null) {
			return RoomMap.toDomain(roomRecord);
		}
		else {
			return null;
		}
	}
}
