import { Container, Service, Inject } from 'typedi';
import config from '../../config';

import IRoomService from '../services/IServices/IRoomService';
import IRoomRepo from './IRepos/IRoomRepo';
import IFloorRepo from './IRepos/IFloorRepo';

import { IRoomDTO } from '../dto/IRoomDTO';

import { Room, RoomProps } from '../domain/Room/Room';
import { RoomDescription } from '../domain/Room/RoomDescription';
import { RoomId } from '../domain/Room/RoomId';
import { RoomPosition } from '../domain/Room/RoomPosition';
import { RoomSize } from '../domain/Room/RoomSize';

import { Result } from "../core/logic/Result";
import { RoomType } from '../domain/Room/RoomType';

@Service()
export default class RoomService implements IRoomService {

    constructor(
        @Inject(config.repos.room.name) private roomRepo: IRoomRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async existRoom(roomId: string): Promise<Result<boolean>> {

        const room = await this.roomRepo.findById(roomId);
        const foundId = !!room;


        if(foundId){
            return Result.ok<boolean>(true);
        }

        return Result.ok<boolean>(false);
    }

    public async CreateRoom(roomDTO: IRoomDTO): Promise<Result<{ roomDTO: IRoomDTO }>> {
        try {
            const roomDocument = await this.roomRepo.findById(roomDTO.roomId);
            const floorDocument = await this.floorRepo.findByDomainId(roomDTO.floor);
            const roomFound = !!roomDocument;
            const floorFound = !!floorDocument;

            if (roomFound) {
                return Result.fail<{ roomDTO: IRoomDTO, token: string }>("Room " + roomDTO.roomId + " already exists");
            }

            if (!floorFound) {
                return Result.fail<{ roomDTO: IRoomDTO, token: string }>("Floor " + roomDTO.floor + " doesn't exist");
            }

            const description = RoomDescription.create(roomDTO.description);
            const size = RoomSize.create(roomDTO.size.width, roomDTO.size.depth);

            if (size.getValue().width > floorDocument.floorSize.width || size.getValue().depth > floorDocument.floorSize.depth) {
                return Result.fail<{ roomDTO: IRoomDTO, token: string }>("Invalid Size: Room cannot be bigger than its floor");
            }

            const position = RoomPosition.create(roomDTO.position.posX, roomDTO.position.posY);

            if (position.getValue().posX >= floorDocument.floorSize.width - 1 || position.getValue().posY >= floorDocument.floorSize.depth - 1) {
                return Result.fail<{ roomDTO: IRoomDTO, token: string }>("Invalid Position: Room must be inside its floor");
            }

            const roomType = RoomType.create(roomDTO.roomType);

            const roomProps: RoomProps = {
                description: description.getValue(),
                size: size.getValue(),
                position: position.getValue(),
                roomType: roomType.getValue(),
                floor: floorDocument
            }

            const id = RoomId.create(roomDTO.roomId);
            const RoomOrError = await Room.create(roomProps, id.getValue());

            if (RoomOrError.isFailure) {
                throw Result.fail<IRoomDTO>(RoomOrError.errorValue());
            }

            const RoomResult = RoomOrError.getValue();
            await this.roomRepo.save(RoomResult);

            return Result.ok<{ roomDTO: IRoomDTO }>({ roomDTO });
        }
        catch (e) {
            throw e;
        }
    }

}
