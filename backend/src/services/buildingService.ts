import { Container, Service, Inject } from 'typedi';


import config from '../../config';


//import MailerService from './mailer.ts.bak';

import IBuildingService from '../services/IServices/IBuildingService';
import  IBuildingDTO  from '../dto/IBuildingDTO';

import IBuildingRepo from './IRepos/IBuildingRepo';

import { Building, BuildingProps } from '../domain/Building/Building';
import { BuildingDescription } from '../domain/Building/BuildingDescription';
import { BuildingId } from '../domain/Building/BuildingId';
import { BuildingName } from '../domain/Building/BuildingName';
import { BuildingSize } from '../domain/Building/BuildingSize';
import { BuildingMap } from "../mappers/BuildingMap";

import { Result } from "../core/logic/Result";
import { error } from 'console';


@Service()
export default class BuildingService implements IBuildingService {
    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo

    ) { }


    public async CreateBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
    

        try {
            const buildingDocument = await this.buildingRepo.findById(buildingDTO.id);
            const found = !!buildingDocument;

            if (found) {
                return Result.fail<IBuildingDTO>("Building already exists with id=" + buildingDTO.id);
            }

            const name = BuildingName.create(buildingDTO.name);
            if (name.isFailure ) {
                return Result.fail<IBuildingDTO>(name.errorValue());
            }
            const description = BuildingDescription.create(buildingDTO.description);
            if (description.isFailure ) {
                return Result.fail<IBuildingDTO>(description.errorValue());
            }
            const size = BuildingSize.create(buildingDTO.width, buildingDTO.depth);
            if (size.isFailure ) {
                
                return Result.fail<IBuildingDTO>(size.errorValue());
            }

            
            const buildingProps: BuildingProps = {
                name: name.getValue(),
                description: description.getValue(),
                size: size.getValue()
            }

            const id = BuildingId.create(buildingDTO.id);
            const BuildingOrError = await Building.create(buildingProps, id.getValue());

            if (BuildingOrError.isFailure) {
                return Result.fail<IBuildingDTO>(BuildingOrError.errorValue());
            }

            const BuildingResult = BuildingOrError.getValue();



            const buildSaved= await this.buildingRepo.save(BuildingResult);
            if(buildSaved ==null){
               return Result.fail <IBuildingDTO>("error to save the Building");
            }
            const buildingDTOResult = BuildingMap.toDTO(BuildingResult) as IBuildingDTO;

            
            return Result.ok <IBuildingDTO>(buildingDTO);

        } catch (e) {
            return Result.fail <IBuildingDTO>("error to create the Building");
        }   }

    public async ListBuilding(): Promise<Result<IBuildingDTO[]>>{
       
            
          try{
         
            const buildings: Building[] = await this.buildingRepo.listAll(); 

            const buildingDTO: IBuildingDTO[] = [];
            
            for (var i = 0; i < buildings.length; i++) {
            const getBuilding: Building =  await buildings[i];      
            
              var buildingDTOindividual=(await BuildingMap.toDTO(getBuilding));
            
              buildingDTO.push(buildingDTOindividual);
            }
          

            return  Result.ok < IBuildingDTO[] >(buildingDTO);

        }catch(e){
            return Result.fail <IBuildingDTO[]>(e);
        }
          }

    public async existBuilding(buildingId: string): Promise<Result<boolean>> {

            const building = await this.buildingRepo.findById(buildingId);

            const found = !!building;

            return Result.ok<boolean>(found);

    }

    public async  updateBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
        
        var buildingToUpdate :Building = await this.buildingRepo.findById(buildingDTO.id);
        
        if(buildingToUpdate==null){
            return Result.fail<IBuildingDTO>("building not found");
        }
        try{
            
           if(buildingDTO.name !=null){
                await buildingToUpdate.setName(buildingDTO.name);
               
           }   
           if(buildingDTO.description !=null){
                
                await buildingToUpdate.setDescription(buildingDTO.description);
            
            }
           if(buildingDTO.width !=null || buildingDTO.depth != null)
            {
            await buildingToUpdate.setSize(buildingDTO.width,buildingDTO.depth);
           }
          
           await this.buildingRepo.updateOne(buildingToUpdate);

          
            return Result.ok < IBuildingDTO>(buildingDTO);

        }catch(e){
            return Result.fail<IBuildingDTO>(e);
        }
    }
   
}
