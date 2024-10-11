import { Service, Inject } from 'typedi';

import IRobotRepo from "../services/IRepos/IRobotRepo";
import { Robot } from "../domain/Robot/Robot";
import { RobotId } from "../domain/Robot/RobotId";
import { RobotSerialNumber } from "../domain/Robot/RobotSerialNumber";
import { NickName } from "../domain/Robot/NickName";

import { RobotMap } from "../mappers/RobotMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IRobotPersistence } from '../dataschema/IRobotPersistence';

@Service()
export default class RobotRepo implements IRobotRepo {
    private models: any;

    constructor(
        @Inject('robotSchema') private robotSchema: Model<IRobotPersistence & Document>,
    ) { }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async exists(robot: Robot | string): Promise<boolean> {

        const idX = robot instanceof RobotId ? (<RobotId>robot).id.toValue() : robot;

        const query = { domainId: idX };
        const robotDocument = await this.robotSchema.findOne(query);

        return !!robotDocument === true;
    }


    public async save(robot: Robot): Promise<Robot> {
        const query = { domainId: robot.id.toString() };

        const robotDocument = await this.robotSchema.findOne(query);

        try {
            if (robotDocument === null) {
                const rawRobot: any = RobotMap.toPersistence(robot);

                const robotCreated = await this.robotSchema.create(rawRobot);

                return RobotMap.toDomain(robotCreated);
            } else {
                robotDocument.serialNumber = robot.serialNumber;
                robotDocument.nickName = robot.nickName;
                robotDocument.description = robot.description;
                robotDocument.robotTypeId = robot.robotTypeId.toString();
                robotDocument.inhibited = robot.inhibited;

                await robotDocument.save();

                return robot;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findById(robotId: RobotId | string): Promise<Robot> {

        const idX = robotId instanceof RobotId ? (<RobotId>robotId).id.toValue() : robotId;
        
        const query = { domainId: idX };
        const robotDocument = await this.robotSchema.findOne(query);
         if (robotDocument != null) {
            return await RobotMap.toDomain(robotDocument);
        }
        else
            return null;
    }

    public async findByNickName(name: NickName | string): Promise<Robot> {
        const nameX = name instanceof NickName ? (<NickName>name).value.toString() : name;
        const query = { nickName: nameX };
        const robotRecord = await this.robotSchema.findOne(query);

        if (robotRecord != null) {
            return RobotMap.toDomain(robotRecord);
        }
        else
            return null;
    }

    public async listAll(): Promise<Robot[]> {

        var robotRecords = await this.robotSchema.find();
        var robots: Robot[] = [];
        const length = robotRecords.length;
        for (var i = 0; i < length; i++) {

            robots.push(await RobotMap.toDomain(robotRecords.pop()));
        }

        return robots;
    }

    public async updateOne(robot: Robot): Promise<Robot> {
        try {
            const rawRobot: any = RobotMap.toPersistence(robot);


            const robotUpdated = await this.robotSchema.updateOne(
                { domainId: robot.id.toValue() }, // find the robots by Id 
                { $set: rawRobot } //  update the data of Robots 
            );


            return robot;

        } catch (err) {
            throw err
        }


        return
    }
}
