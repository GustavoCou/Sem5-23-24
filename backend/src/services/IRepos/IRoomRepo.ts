import { Repo } from "../../core/infra/Repo";
import { Room } from "../../domain/Room/Room";
import { RoomDescription } from "../../domain/Room/RoomDescription";
import { RoomId } from "../../domain/Room/RoomId";

export default interface IRoomRepo extends Repo<Room> {

    exists(rom: Room | string): Promise<boolean>;
    save(room: Room): Promise<Room>;
    findById(roomId: RoomId | string): Promise<Room>;

}