import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IFloorPersistence } from '../dataschema/IFloorPersistence';

import IFloorRepo from '../services/IRepos/IFloorRepo';
import { Floor } from '../domain/Floor/Floor';
import { FloorID } from '../domain/Floor/FloorID';
import { FloorMap } from '../mappers/FloorMap';
import { Result } from '../core/logic/Result';

@Service()
export default class FloorRepo implements IFloorRepo {
    private models: any;

    constructor(
        @Inject('floorSchema') private floorSchema: Model<IFloorPersistence & Document>,
    ) { }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async exists(floor: Floor | string): Promise<boolean> {

        const idX = floor instanceof FloorID ? (<FloorID>floor).id.toValue() : floor;

        const query = { domainId: idX };
        const floorDocument = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

        return !!floorDocument === true;
    }

    public async save(floor: Floor): Promise<Floor> {
        const query = { domainId: floor.id.toString() };

        const floorDocument = await this.floorSchema.findOne(query);

        try {
            if (floorDocument === null) {
                const rawFloor: any = FloorMap.toPersistence(floor);

                const floorCreated = await this.floorSchema.create(rawFloor);

                return FloorMap.toDomain(floorCreated);
            } else {
                floorDocument.floorDescription = floor.floorDescription.toString();
                floorDocument.floorSize = {
                    width: floor.floorSize.width,
                    depth: floor.floorSize.depth,
                };
                floorDocument.floorMapa = {
                    maze: floor.floorMapa.maze,
                    ground: floor.floorMapa.ground,
                    wall: floor.floorMapa.wall,
                    player: floor.floorMapa.player,
                };
                floorDocument.building;
                await floorDocument.save();

                return floor;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findByDomainId(floorId: FloorID | String): Promise<Floor> {

        const idX = floorId instanceof FloorID ? (<FloorID>floorId).id.toValue() : floorId;

        const query = { domainId: idX };
        const floorRecord = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

        if (floorRecord !== null) {
            return await FloorMap.toDomain(floorRecord);
        } else {
            return null;
        }
    }

    public async updateOne(floor: Floor): Promise<Floor> {
        try {
            const rawfloor: any = FloorMap.toPersistence(floor);

            const buildingUpdated = await this.floorSchema.updateOne({
                domainId: floor.id.toValue()
            }, // find the buildings by Id 
                {
                    $set: rawfloor //  update the data of Buildings
                });
            return floor;
        } catch (err) {
            throw err
        }
    }

    public async getAll(): Promise<Floor[]> {
        try {
            const floorRecords = await this.floorSchema.find();
            const floors: Floor[] = [];
    
            for (let i = 0; i < floorRecords.length; i++) {
                const floorRecord = floorRecords[i];
                const floor = await FloorMap.toDomain(floorRecord);
    
                // Certifique-se de que o método toDomain() está mapeando corretamente o floorMapa
                // Certifique-se de que a estrutura do seu documento MongoDB inclui os campos necessários para o floorMapa
    
                floors.push(floor);
            }
    
            return floors;
        } catch (error) {
            throw error;
        }
    }

    public async findFloorsByBuilding(buildingId: string): Promise<Floor[]> {
        const query = { building: buildingId };
        const floorsInBuilding = await this.floorSchema.find(query as FilterQuery<IFloorPersistence & Document>);
        const floors: Floor[] = [];

        for (let i = 0; i < floorsInBuilding.length; i++) {
            const floorRecord = floorsInBuilding[i];
            const floor = await FloorMap.toDomain(floorRecord);
            floors.push(floor);
        }

        return floors;
    }

    public async existFloorByBuildingAndFloorId(buildingId: string, floorId: FloorID | String): Promise<Floor> {

        const idX = floorId instanceof FloorID ? (<FloorID>floorId).id.toValue() : floorId;

        const query = { domainId: idX, building: buildingId };
        const floorRecord = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

        if (floorRecord !== null) {
            return await FloorMap.toDomain(floorRecord);
        } else {
            return null;
        }
    }

    public async countFloorsByBuilding(buildingId: string): Promise<number> {
        const query = { building: buildingId };
        const count = await this.floorSchema.countDocuments(query as FilterQuery<IFloorPersistence & Document>);
        return count;
    }

    public async findById(floorId: FloorID | string): Promise<Floor> {
        const idX = floorId instanceof FloorID ? (<FloorID>floorId).id.toString() : floorId;
        const query = { domainId: idX };
        const floorRecord = await this.floorSchema.findOne(query);

        if (floorRecord != null) {
            return FloorMap.toDomain(floorRecord);
        }
        else {
            return null;
        }
    }
}