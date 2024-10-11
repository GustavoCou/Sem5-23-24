import { Container, Service, Inject } from 'typedi';


import config from '../../config';


//import MailerService from './mailer.ts.bak';

import IRobotTypeService from '../services/IServices/IRobotTypeService';
import { IRobotTypeDTO } from '../dto/IRobotTypeDTO';

import IRobotTypeRepo from './IRepos/IRobotTypeRepo';
import { RobotType, RobotTypeProps } from '../domain/RobotType/RobotType';
import { RobotTypeId } from '../domain/RobotType/RobotTypeId';
import { RobotTypeModel } from '../domain/RobotType/RobotTypeModel';
import { RobotTypeBrand } from '../domain/RobotType/RobotTypeBrand';
import { RobotTypeMap } from "../mappers/RobotTypeMap";

import { Result } from "../core/logic/Result";
import { RobotTypeTasks } from '../domain/RobotType/RobotTypeTasks';

@Service()
export default class RobotTypeService implements IRobotTypeService {
    constructor(
        @Inject(config.repos.robotType.name) private robotTypeRepo: IRobotTypeRepo
    ) { }


    public async createRobotType(robotTypeDTO: IRobotTypeDTO): Promise<Result<IRobotTypeDTO>> {
        try {
            // Check if the RobotType with the given id already exists
            const robotTypeDocument = await this.robotTypeRepo.findById(robotTypeDTO.id);
            const found = !!robotTypeDocument;
    
            if (found) {
                return Result.fail<IRobotTypeDTO>("RobotType already exists with id = " + robotTypeDTO.id);
            }

            // Validate and create RobotTypeModel
            const robotTypeRobotModelOrError = RobotTypeModel.create(robotTypeDTO.robotModel);
            if (robotTypeRobotModelOrError.isFailure) {
                return Result.fail<IRobotTypeDTO>(`Invalid robotModel: ${robotTypeRobotModelOrError.errorValue()}`);
            }
    
            // Validate and create RobotTypeBrand
            const robotTypeBrandOrError = RobotTypeBrand.create(robotTypeDTO.brand);
            if (robotTypeBrandOrError.isFailure) {
                return Result.fail<IRobotTypeDTO>(`Invalid brand: ${robotTypeBrandOrError.errorValue()}`);
            }
    
            // Validate and create RobotTypeTasks
            const robotTypeTasksOrError = RobotTypeTasks.create(robotTypeDTO.tasks);
            if (robotTypeTasksOrError.isFailure) {
                return Result.fail<IRobotTypeDTO>(`Invalid tasks: ${robotTypeTasksOrError.errorValue()}`);
            }
    
            // Validate RobotTypeId
            const id = RobotTypeId.create(robotTypeDTO.id);
    
            // Validate and create RobotType
            const robotTypeOrError = await RobotType.create({
                ...robotTypeDTO,
                robotModel: robotTypeRobotModelOrError.getValue(),
                brand: robotTypeBrandOrError.getValue(),
                tasks: robotTypeTasksOrError.getValue(),
            }, id.getValue());
    
            if (robotTypeOrError.isFailure) {
                return Result.fail<IRobotTypeDTO>(`Failed to create RobotType: ${robotTypeOrError.errorValue()}`);
            }
    
            // Save the validated RobotType
            const robotTypeResult = robotTypeOrError.getValue();
            await this.robotTypeRepo.save(robotTypeResult);
    
            // Map and return the result as DTO
            const robotTypeDTOResult = RobotTypeMap.toDTO(robotTypeResult) as IRobotTypeDTO;
            return Result.ok<IRobotTypeDTO>(robotTypeDTOResult);
        } catch (e) {
            // Handle any unexpected exceptions
            console.error("An error occurred while creating RobotType:", e);
            return Result.fail<IRobotTypeDTO>("An unexpected error occurred");
        }
    }
    
    public async ListRobotType(): Promise<Result<{robotTypeDTO: IRobotTypeDTO[]}>>{
      
            
          try{
         
            const robotTypes: RobotType[] = await this.robotTypeRepo.listAll(); 

            const robotTypeDTO: IRobotTypeDTO[] = [];
            
            for (var i = 0; i < robotTypes.length; i++) {
            const getRobotType: RobotType =  await robotTypes[i];      
            
              var robotTypeDTOindividual=(await RobotTypeMap.toDTO(getRobotType));
            
              robotTypeDTO.push(robotTypeDTOindividual);
            }
        
            return  Result.ok <{ robotTypeDTO: IRobotTypeDTO[] }>({robotTypeDTO});

        } catch(e){
            throw e;
        }
    }

    public async  updateRobotType(robotTypeDTO: IRobotTypeDTO): Promise<Result<{ robotTypeDTO: IRobotTypeDTO}>> {
        
        var robotTypeToUpdate :RobotType = await this.robotTypeRepo.findById(robotTypeDTO.id);
 
        try{
            
           if(robotTypeDTO.robotModel !=null){
                await robotTypeToUpdate.setModel(robotTypeDTO.robotModel);
               
           }   
           
           if(robotTypeDTO.brand !=null )
            {
            await robotTypeToUpdate.setBrand(robotTypeDTO.brand);
           }
          
           await this.robotTypeRepo.updateOne(robotTypeToUpdate);

          
            return Result.ok < { robotTypeDTO: IRobotTypeDTO }>({robotTypeDTO});

        }catch(e){
            throw e;
        }
    }
   
}
