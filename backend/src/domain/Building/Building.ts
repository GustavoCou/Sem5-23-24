import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import {BuildingSize} from "./BuildingSize";
import {BuildingName} from "./BuildingName";
import {BuildingDescription} from "./BuildingDescription";
import {BuildingId} from "./BuildingId";
import { Result } from "../../core/logic/Result";
// import { FloorId } from "../../core/domain/Floor/FloorId";

export interface BuildingProps {
    name: BuildingName;
    description: BuildingDescription;
    size: BuildingSize;
    
  }
  
  export class Building extends AggregateRoot<BuildingProps> {

     // Private property to hold an array of FloorId objects
    private floors: string[] = [];

    get id (): UniqueEntityID {
    
      return this._id;
      }
        
    get width(): number {
      return this.props.size.valueWidth;
    }

        
      get depth(): number {
        return this.props.size.valuedDepth;
      }
    
      get name (): string {
        return this.props.name.value;
      }
    
      get description (): string {
        return this.props.description.value;
      }

      addFloor(floorId: string): void {
        this.floors.push(floorId);
      }
    
      // Method to remove a FloorId object from the array
      removeFloor(floorId: string): void {
        const index = this.floors.indexOf(floorId);
        if (index !== -1) {
          this.floors.splice(index, 1);
        }
      }
    
      // Method to access the array of FloorId objects
      getFloors(): string[] {
        return this.floors;
      }
    
    
      private constructor (props: BuildingProps, id?: UniqueEntityID) {
        super(props, id);
      }
    
      public static create (props: BuildingProps, id: BuildingId): Result<Building> {
    
        const guardedProps = [
          { argument: props.name, argumentName: 'name' },
          { argument: props.description, argumentName: 'description' },
          { argument: props.size, argumentName: 'size' }          
        ];
    
      
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
        if (!guardResult.succeeded) {
          return Result.fail<Building>(guardResult.message)
        }     
        else {
          const building = new Building({...props}, id.id);

        return Result.ok<Building>(building);
      }
    }

  public async setDescription(description :string):Promise<Boolean> {

        
    const  newDescription= await BuildingDescription.create(description);
    this.props.description=newDescription.getValue();

    if(newDescription.isSuccess){
      return newDescription.isSuccess; 

    }else{

      throw newDescription.errorValue();
    }

    }
    public async  setName(name :string):Promise<Boolean> {


      const  newName= await BuildingName.create(name);
      this.props.name=newName.getValue();

      if(newName.isSuccess){
        return newName.isSuccess; 

      }else{

        throw newName.errorValue();
      }

    }
     public async setSize(width?: number,depth?:number):Promise<Boolean> {
    
      var  newSize :Result<BuildingSize>;

      if(width != null && depth!=null){

        newSize=BuildingSize.create(width,depth);   
      }else if(width != null){
        newSize=BuildingSize.create(width,this.props.size.valuedDepth);   
      }else{
        newSize=BuildingSize.create(this.props.size.valueWidth,depth);  
      }

      if(newSize.isSuccess){
        this.props.size=newSize.getValue();
        return newSize.isSuccess; 

      }else{

        throw newSize.errorValue();
      }
          
    
      

  }
  }