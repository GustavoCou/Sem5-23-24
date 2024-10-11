import { expect } from 'chai';
import 'mocha';

import { RoomId } from '../../../src/domain/Room/RoomId';
import RoomService from '../../../src/services/RoomService';
import { Room, RoomProps } from '../../../src/domain/Room/Room';
import { RoomDescription } from '../../../src/domain/Room/RoomDescription';
import { RoomSize } from '../../../src/domain/Room/RoomSize';
import { RoomPosition } from '../../../src/domain/Room/RoomPosition';
import { RoomType } from '../../../src/domain/Room/RoomType';
import { IRoomDTO } from '../../../src/dto/IRoomDTO';
import { Floor, FloorProps } from '../../../src/domain/Floor/Floor';
import Container from 'typedi';
import config from '../../../config';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorSize } from '../../../src/domain/Floor/FloorSize';
import { FloorMapa } from '../../../src/domain/Floor/FloorMapa';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { FloorID } from '../../../src/domain/Floor/FloorID';

export class RoomRepoMock {

	private rooms: Room[];

	public constructor() {
		this.rooms = [];
	}

	public async findById(id: RoomId | string): Promise<Room | undefined> {
		let roomDocument = this.rooms.find(room => room.id.toString() === id);
		return Promise.resolve(roomDocument);
	}

	public async save(room: Room): Promise<Room> {
		this.rooms.push(room);
		return room;
	}

	public async exists(room: Room | string): Promise<Boolean> {
		const idX = room instanceof RoomId ? (<RoomId>room).id.toValue() : room;

		return !!this.rooms.find(room => room.id.toString() === idX);
	}

	public addRoom(room: Room) {
		this.rooms.push(room);
	}

}

export class FloorRepoMock {

	async findByDomainId(id: string): Promise<Floor | undefined> {
		return this.floors.find(floor => floor.id.toString() === id);
	}

	async save(floor: Floor): Promise<Floor> {

		this.floors.push(floor);

		return floor;
	}

	addFloor(floor: Floor) {
		this.floors.push(floor);
	}

	private floors: Floor[] = [];

}

describe('RoomService', () => {
	let roomService: RoomService;
	let roomRepo = new RoomRepoMock();
	let floorRepo = new FloorRepoMock();

	let floorProps: FloorProps = {
		floorDescription: FloorDescription.create("B1 Description").getValue(),
		floorSize: FloorSize.create(10, 10).getValue(),
		floorMapa: FloorMapa.create(undefined).getValue(),
		building: Building.create({
			name: BuildingName.create("Building B").getValue(),
			description: BuildingDescription.create("Building B Description").getValue(),
			size: BuildingSize.create(10, 10).getValue()
		},
			BuildingId.create("B").getValue()
		).getValue()
	};

	let floor: Floor = Floor.create(floorProps, FloorID.create("B1").getValue()).getValue();
	floorRepo.addFloor(floor);

	let roomProps: RoomProps = {
		description: RoomDescription.create("Sala T").getValue(),
		size: RoomSize.create(2, 2).getValue(),
		position: RoomPosition.create(0, 0).getValue(),
		roomType: RoomType.create("Outro").getValue(),
		floor: floor
	}

	let room: Room = Room.create(roomProps, RoomId.create("B101").getValue()).getValue();
	roomRepo.addRoom(room);

	Container.set(config.repos.floor.name, floorRepo);
	Container.set(config.repos.room.name, roomRepo);

	roomService = Container.get(RoomService);

	const roomDTO: IRoomDTO = {
		roomId: "B102",
		description: "Sala T",
		size: {
			width: 2,
			depth: 2
		},
		position: {
			posX: 6,
			posY: 1
		},
		roomType: "Outro",
		floor: "B1"
	};

	beforeEach(() => {
	});

	it('should create a room with valid properties', async () => {
		const result = await roomService.CreateRoom(roomDTO);
		expect(result.isSuccess).to.be.true;
	});

	it('should not create a room if it already exists', async () => {
		roomDTO.roomId = "B101";

		const result = await roomService.CreateRoom(roomDTO);
		expect(result.isSuccess).to.be.false;
	});

	it('should not create a room if floor does not exist', async () => {
		roomDTO.floor = "B2";

		const result = await roomService.CreateRoom(roomDTO);
		expect(result.isSuccess).to.be.false;
	});

	it('should not create a room if size invalid', async () => {
		roomDTO.size.depth = 11;
		roomDTO.size.width = 2;
		const resultDepth = await roomService.CreateRoom(roomDTO);
		expect(resultDepth.isSuccess).to.be.false;

		roomDTO.size.depth = 2
		roomDTO.size.width = 11;
		const resultWidth = await roomService.CreateRoom(roomDTO);
		expect(resultWidth.isSuccess).to.be.false;
	});

	it('should not create a room if position invalid', async () => {
		roomDTO.position.posX = 11;
		roomDTO.position.posY = 1;
		const resultPosX = await roomService.CreateRoom(roomDTO);
		expect(resultPosX.isSuccess).to.be.false;

		roomDTO.position.posX = 6
		roomDTO.position.posY = 11;
		const resultPosY = await roomService.CreateRoom(roomDTO);
		expect(resultPosY.isSuccess).to.be.false;
	});
});