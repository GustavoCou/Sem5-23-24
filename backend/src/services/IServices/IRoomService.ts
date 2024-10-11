import { Result } from "../../core/logic/Result";
import { IRoomDTO } from "../../dto/IRoomDTO";

export default interface IRoomService {

    CreateRoom(roomDTO: IRoomDTO): Promise<Result<{ roomDTO: IRoomDTO }>>;
    existRoom(roomId: string): Promise<Result<boolean>>;

}