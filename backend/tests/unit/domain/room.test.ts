import { expect } from 'chai';
import { Room, RoomProps } from '../../../src/domain/Room/Room';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { RoomDescription } from '../../../src/domain/Room/RoomDescription';
import { RoomSize } from '../../../src/domain/Room/RoomSize';
import { RoomPosition } from '../../../src/domain/Room/RoomPosition';
import { RoomType } from '../../../src/domain/Room/RoomType';
import { Floor, FloorProps } from '../../../src/domain/Floor/Floor';
import { RoomId } from '../../../src/domain/Room/RoomId';
import { Building, BuildingProps } from '../../../src/domain/Building/Building';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorSize } from '../../../src/domain/Floor/FloorSize';
import { FloorMapa } from '../../../src/domain/Floor/FloorMapa';
import { FloorID } from '../../../src/domain/Floor/FloorID';

describe('Room', () => {
    let buildingProps: BuildingProps = {
        name: BuildingName.create('Valid Building Name').getValue(),
        description: BuildingDescription.create('Valid Building Description').getValue(),
        size: BuildingSize.create(10, 10).getValue()
    }
    let buildingDocument = Building.create(buildingProps, BuildingId.create("B").getValue());

    let floorProps: FloorProps = {
        floorDescription: FloorDescription.create("Salas TP").getValue(),
        floorSize: FloorSize.create(10, 10).getValue(),
        floorMapa: FloorMapa.create(undefined).getValue(),
        building: buildingDocument.getValue()
    }
    let floorDocument = Floor.create(floorProps, FloorID.create("B1").getValue());

    let validRoomProps: RoomProps;

    beforeEach(() => {
        validRoomProps = {
            description: RoomDescription.create("Valid room description").getValue(),
            size: RoomSize.create(5, 2).getValue(),
            position: RoomPosition.create(0, 1).getValue(),
            roomType: RoomType.create("Outro").getValue(),
            floor: floorDocument.getValue()
        };
    });

    it('should create a room instance with valid properties', () => {
        let roomId = RoomId.create("B103").getValue();
        let roomResult = Room.create(validRoomProps, roomId);

        expect(roomResult.isSuccess).to.be.true;

        let room = roomResult.getValue();

        expect(room.id.toString()).to.equal(roomId.id.toValue());
        expect(room.description).to.equal(validRoomProps.description.value);
        expect(room.width).to.equal(validRoomProps.size.width);
        expect(room.depth).to.equal(validRoomProps.size.depth);
        expect(room.posX).to.equal(validRoomProps.position.posX);
        expect(room.posY).to.equal(validRoomProps.position.posY);
    });

    it('should not create a room instance with invalid properties', () => {
        let roomId = RoomId.create('B-103');
        expect(roomId.isSuccess).to.be.false;

        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
        let largeString = "";
        for (let i = 0; i < 251; i++) {
            largeString += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        let roomDescription = RoomDescription.create(largeString);
        expect(roomDescription.isSuccess).to.be.false;

        let roomSize = RoomSize.create(1, 0);
        expect(roomSize.isSuccess).to.be.false;

        let roomPosition = RoomPosition.create(-1, 0);
        expect(roomPosition.isSuccess).to.be.false;

        let roomType = RoomType.create("Sala");
        expect(roomType.isSuccess).to.be.false;
    });
});


