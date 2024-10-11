import { Inject, Service } from "typedi";
import { Document, Model } from "mongoose";
import IBridgeDTO from "../dto/IBridgeDTO";
import { IBridgePersistence } from "../dataschema/IBridgePersistence";
import { Bridge } from "../domain/Bridge/Bridge";
import { BridgeMap } from "../mappers/BridgeMap";
import IBridgeRepo from "../services/IRepos/IBridgeRepo";
import { BridgeId } from "../domain/Bridge/BridgeId";
import { BuildingId } from "../domain/Building/BuildingId";
import { Building } from "../domain/Building/Building";
import BridgeError from "../exceptions/bridgeException";

@Service()
export default class BridgeRepo implements IBridgeRepo {
    private models: Bridge;

    constructor(
        @Inject('bridgeSchema') private bridgeSchema: Model<IBridgePersistence & Document>,

    ) { }


    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    //ALTERAÇAO: removidofindOne +  alterado any = Bridge
    public async save(bridge: Bridge): Promise<Bridge> {

        try {
            const rawBridge: Bridge = BridgeMap.toPersistence(bridge);

            const bridgeCreated = await this.bridgeSchema.create(rawBridge);
            return BridgeMap.toDomain(bridgeCreated);
        } catch (e) {
            throw new BridgeError("Error on saving the bridge");
        }
    }

    public async bridgeWithFloors(floorId1: string, floorId2: string): Promise<boolean> {
        try {

            const query = {
                $or: [{ floorIdX: floorId1, floorIdY: floorId2 },
                { floorIdX: floorId2, floorIdY: floorId1 }]
            };

            const findFloors = await this.bridgeSchema.findOne(query);

            return findFloors != null;

        } catch (e) {
            throw new BridgeError("Error on checking the bridge with floors");
        }
    }


    public async findById(bridgeId: string): Promise<Boolean> {
        try {


            const query = { bridgeId: bridgeId };
            const bridgeDocument = await this.bridgeSchema.findOne(query);
            return bridgeDocument !== null;
        } catch (error) {
            throw new BridgeError("Error on checking the id bridge");
        }
    }


    public async findAndGiveBridge(bridgeId: BridgeId | string): Promise<Bridge> {
        try {
            const idX = bridgeId instanceof BridgeId ? (<BridgeId>bridgeId).toString() : bridgeId;

            const query = { domainId: idX };
            const bridgeDocument = await this.bridgeSchema.findOne(query);

            if (bridgeDocument != null) {
                return await BridgeMap.toDomain(bridgeDocument);
            }
            else
                return null;
        } catch (error) {
            throw new BridgeError("Error on finding and return the bridge");
        }
    }

    //ALTERAÇAO: REMOVER O ANY PARA BRIGDE
    public async updateOne(bridge: Bridge): Promise<Bridge> {
        try {
            const rawBridge: Bridge = BridgeMap.toPersistence(bridge);


            const bridgeUpdated = await this.bridgeSchema.findOneAndUpdate(
                { domainId: bridge.bridgeId.toString() },
                rawBridge,
                { new: true } // troquei o $set por new: true , pq o $set n conseguia usar bridge
            );
            return BridgeMap.toDomain(bridgeUpdated);
        } catch (error) {
            throw new BridgeError("Error on update bridge");
        }
    }



    public async listAll(): Promise<Bridge[]> {

        try {
            let bridgeRecords = await this.bridgeSchema.find();

            let bridges: Bridge[] = [];

            const length = bridgeRecords.length;

            for (let i = 0; i < length; i++) {

                bridges.push(await BridgeMap.toDomain(bridgeRecords.pop()));

            }

            return bridges;

        } catch (error) {
            throw new BridgeError("Error on listing the bridge");
        }
    }



    public async listAllWithBuilding(building: Building): Promise<Bridge[]> {
        try {

            let bridgeRecords = await this.bridgeSchema.find({
                $or: [
                    { buildingX: building.id },
                    { buildingY: building.id }
                ]
            });

            let bridges: Bridge[] = [];

            const length = bridgeRecords.length;

            for (let i = 0; i < length; i++) {

                bridges.push(await BridgeMap.toDomain(bridgeRecords.pop()));

            }

            return bridges;
        } catch (error) {
            throw new BridgeError("Error on listing");
        }
    }

    //du
    public async exists(bridge: Bridge | string): Promise<boolean> {

        const idX = bridge instanceof BridgeId ? (<BridgeId>bridge.bridgeId).toString() : bridge;

        const query = { domainId: idX };
        const bridgeDocument = await this.bridgeSchema.findOne(query);

        return !!bridgeDocument === true;
    }

    public async getBridgeBetweenBuildingsId(buildingX: string, buildingY: string): Promise<Bridge[]> {
        try {
            const query = {
                $or: [
                    { buildingX: buildingX, buildingY: buildingY },
                    { buildingX: buildingY, buildingY: buildingX }
                ]
            };

            let bridgeFound = await this.bridgeSchema.find(query);

            let bridges: Bridge[] = [];

            const length = bridgeFound.length;

            for (let i = 0; i < length; i++) {

                bridges.push(await BridgeMap.toDomain(bridgeFound.pop()));

            }

            return bridges;
        } catch (error) {
            throw new BridgeError("Error on getting the bridges");
        }
    }
}