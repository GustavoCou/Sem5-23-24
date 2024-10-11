import { Container, Service, Inject } from 'typedi';


import config from '../../config';



//import MailerService from './mailer.ts.bak';

import IRobotService from '../services/IServices/IRobotService';
import IRobotDTO from '../dto/IRobotDTO';

import IRobotRepo from './IRepos/IRobotRepo';

import { Robot, RobotProps } from '../domain/Robot/Robot';
import { RobotId } from '../domain/Robot/RobotId';
import { NickName } from '../domain/Robot/NickName';
import { RobotSerialNumber } from '../domain/Robot/RobotSerialNumber';
import { RobotMap } from "../mappers/RobotMap";

import { Result } from "../core/logic/Result";
import { RobotDescription } from '../domain/Robot/RobotDescription';
import { RobotTypeId } from '../domain/RobotType/RobotTypeId';

@Service()
export default class RobotService implements IRobotService {
    constructor(
        @Inject(config.repos.robot.name) private robotRepo: IRobotRepo

    ) { }


    public async CreateRobot(robotDTO: IRobotDTO): Promise<Result<IRobotDTO>> {

        try {
            const robotDocument = await this.robotRepo.findById(robotDTO.id);
            const found = !!robotDocument;
            if (found) {
                return Result.fail<IRobotDTO>("Robot already exists with name=" + robotDTO.id);
            }

            const serialNumber = RobotSerialNumber.create(robotDTO.serialNumber);
            const nickName = NickName.create(robotDTO.nickName);
            const description = RobotDescription.create(robotDTO.description);
            const robotTypeId = RobotTypeId.create(robotDTO.robotTypeId);

            const inhibited = robotDTO.inhibited;

            const robotProps: RobotProps = {
                serialNumber: serialNumber.getValue(),
                nickName: nickName.getValue(),
                description: description.getValue(),
                robotTypeId: robotTypeId.getValue(),
                inhibited: inhibited
            }

            const id = RobotId.create(robotDTO.id);
            const RobotOrError = await Robot.create(robotProps, id.getValue());

            if (RobotOrError.isFailure) {
                return Result.fail<IRobotDTO>(RobotOrError.errorValue());
            }

            const RobotResult = RobotOrError.getValue();



            await this.robotRepo.save(RobotResult);

            const robotDTOResult = RobotMap.toDTO(RobotResult) as IRobotDTO;


            return Result.ok<IRobotDTO>(robotDTO);

        } catch (e) { /* melhorar para ver entre camadas*/
            throw e;
        }
    }

    public async existRobot(robotIdNickName: string): Promise<Result<boolean>> {

        const robotId = await this.robotRepo.findById(robotIdNickName);
        const robotNickName = await this.robotRepo.findByNickName(robotIdNickName);
        const foundId = !!robotId;
        const foundNickName = !!robotNickName;

        if(foundId || foundNickName){
            return Result.ok<boolean>(true);
        }


        return Result.ok<boolean>(false);
    }


    public async ListRobot(): Promise<Result<IRobotDTO[]>> {


        try {

            const robots: Robot[] = await this.robotRepo.listAll();

            const robotDTO: IRobotDTO[] = [];

            for (var i = 0; i < robots.length; i++) {
                const getRobot: Robot = await robots[i];

                var robotDTOindividual = (await RobotMap.toDTO(getRobot));

                robotDTO.push(robotDTOindividual);
            }


            return Result.ok<IRobotDTO[]>(robotDTO);

        } catch (e) {
            throw e;
        }
    }

    public async updateRobot(robotDTO: IRobotDTO): Promise<Result<IRobotDTO>> {

        var robotToUpdate: Robot = await this.robotRepo.findById(robotDTO.id);

        if (robotToUpdate == null) {
            return Result.fail<IRobotDTO>("robot not found");
        }
        try {

            if (robotDTO.nickName != null) {
                await robotToUpdate.setNickName(robotDTO.nickName);

            }
            if (robotDTO.serialNumber != null) {

                await robotToUpdate.setSerialNumber(robotDTO.serialNumber);

            }
            if (robotDTO.description != null) {

                await robotToUpdate.setDescription(robotDTO.description);

            }

            if (robotDTO.robotTypeId != null) {

                await robotToUpdate.setrobotTypeId(robotDTO.robotTypeId);

            }

            if (typeof robotDTO.inhibited === "boolean") {

                await robotToUpdate.setInhibited(robotDTO.inhibited);
            }

            await this.robotRepo.updateOne(robotToUpdate);


            return Result.ok<IRobotDTO>(robotDTO);

        } catch (e) {
            return Result.fail<IRobotDTO>(e);
        }
    }

    public async updateInhibitedStatus(robotDTO: IRobotDTO): Promise<Result<boolean>> {
        var robotToUpdate: Robot = await this.robotRepo.findById(robotDTO.id);
      
        if (!robotToUpdate) {
          return Result.fail<boolean>("Robot not found");
        }
      
        // Directly set the status from the DTO
        robotToUpdate.setInhibited(robotDTO.inhibited);
      
        try {
          await this.robotRepo.updateOne(robotToUpdate);
          return Result.ok<boolean>(true);
        } catch (e) {
          return Result.fail<boolean>(e);
        }
      }
}