import { Service, Inject } from 'typedi';

import IRobotTypeRepo from "../services/IRepos/IRobotTypeRepo";
import { RobotType } from "../domain/RobotType/RobotType";
import { RobotTypeId } from "../domain/RobotType/RobotTypeId";

import { RobotTypeMap } from "../mappers/RobotTypeMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IRobotTypePersistence } from '../dataschema/IRobotTypePersistence';

@Service()
export default class RobotTypeRepo implements IRobotTypeRepo {
  private models: any;

  constructor(
    @Inject('robotTypeSchema') private robotTypeSchema : Model<IRobotTypePersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(robotType: RobotType | string): Promise<boolean> {

    const idX = robotType instanceof RobotTypeId ? (<RobotTypeId>robotType).id.toValue() : robotType;

    const query = { domainId: idX}; 
    const robotTypeDocument = await this.robotTypeSchema.findOne(query  as FilterQuery<IRobotTypePersistence & Document>);

    return !!robotTypeDocument === true;
  }

  public async save(robotType: RobotType): Promise<RobotType>{
    const query = { domainId: robotType.id.toString() }; 

    const robotTypeDocument = await this.robotTypeSchema.findOne(query);

    try {
      if (robotTypeDocument === null ) {
        const rawRobotType: any = RobotTypeMap.toPersistence(robotType);

        const robotTypeCreated = await this.robotTypeSchema.create(rawRobotType);

        return RobotTypeMap.toDomain(robotTypeCreated);
      } else {
        robotTypeDocument.robotModel = robotType.model;        
        robotTypeDocument.brand = robotType.brand;
        robotTypeDocument.tasks = robotType.tasks;
        await robotTypeDocument.save();

        return robotType;
      }
    } catch (err) {
      throw err;
    }
  }
  
  public async findById (robotTypeId: RobotTypeId | String): Promise<RobotType> {

    const idX = robotTypeId instanceof RobotTypeId ? (<RobotTypeId>robotTypeId).id.toValue() : robotTypeId;
    
    const query = { domainId: idX}; 
    const robotTypeDocument = await this.robotTypeSchema.findOne(query as FilterQuery<IRobotTypePersistence & Document>);
    
    if( robotTypeDocument != null) {
      return await  RobotTypeMap.toDomain(robotTypeDocument);
    }
    else
      return null;
  }

  public async listAll(): Promise<RobotType[]> {
   
    var robotTypeRecords = await this.robotTypeSchema.find();
    var robotTypes: RobotType[]= [];
    const length= robotTypeRecords.length;
    for(var i=0; i < length;i++ ){

      robotTypes.push(await  RobotTypeMap.toDomain(robotTypeRecords.pop()));
    }
    
         return robotTypes;
    }
  
  public async updateOne(robotType: RobotType): Promise<RobotType> {
    try {
      const rawRobotType: any = RobotTypeMap.toPersistence(robotType);
         
    
      const robotTypeUpdated= await this.robotTypeSchema.updateOne(
        { domainId: robotType.id.toValue() }, // find the robotTypes by Id 
        { $set:rawRobotType} //  update the data of RobotTypes 
      );

     
      return robotType;

    }catch(err){
      throw err
    }
}
}
