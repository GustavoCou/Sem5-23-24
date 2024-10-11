import { Service, Inject } from 'typedi';

import IBuildingRepo from "../services/IRepos/IBuildingRepo";
import { Building } from "../domain/Building/Building";
import { BuildingId } from "../domain/Building/BuildingId";
import { BuildingName } from "../domain/Building/BuildingName";
import { BuildingMap } from "../mappers/BuildingMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

@Service()
export default class BuildingRepo implements IBuildingRepo {
  private models: any;

  constructor(
    @Inject('buildingSchema') private buildingSchema: Model<IBuildingPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(building: Building | string): Promise<boolean> {

    const idX = building instanceof BuildingId ? (<BuildingId>building).id.toValue() : building;

    const query = { domainId: idX };
    const buildingDocument = await this.buildingSchema.findOne(query);

    return !!buildingDocument === true;
  }


  public async save(building: Building): Promise<Building> {
    const query = { domainId: building.id.toString() };

    const buildingDocument = await this.buildingSchema.findOne(query);

    try {
      if (buildingDocument === null) {
        const rawBuilding: any = BuildingMap.toPersistence(building);

        const buildingCreated = await this.buildingSchema.create(rawBuilding);

        return BuildingMap.toDomain(buildingCreated);
      } else {
        buildingDocument.name = building.name;
        buildingDocument.description = building.description;
        buildingDocument.width = building.width;
        buildingDocument.depth = building.depth;
        await buildingDocument.save();

        return building;
      }
    } catch (err) {
      return null;
    }
  }

  public async findById(buildingId: BuildingId | string): Promise<Building> {


    const idX = buildingId instanceof BuildingId ? (<BuildingId>buildingId).id.toValue() : buildingId;

    const query = { domainId: idX };
    const buildingDocument = await this.buildingSchema.findOne(query);

    if (buildingDocument != null) {

      return await BuildingMap.toDomain(buildingDocument);
    }
    else
      return null;
  }

  public async findByName(name: BuildingName | string): Promise<Building> {
    const nameX = name instanceof BuildingName ? (<BuildingName>name).value : name;

    const query = { domainName: nameX };
    const buildingRecord = await this.buildingSchema.findOne(query);

    if (buildingRecord != null) {
      return BuildingMap.toDomain(buildingRecord);
    }
    else
      return null;
  }

  public async listAll(): Promise<Building[]> {

    var buildingRecords = await this.buildingSchema.find();
    var buildings: Building[] = [];
    const length = buildingRecords.length;
    for (var i = 0; i < length; i++) {

      buildings.push(await BuildingMap.toDomain(buildingRecords.pop()));
    }

    return buildings;
  }

  public async updateOne(building: Building): Promise<Building> {
    try {
      const rawBuilding: any = BuildingMap.toPersistence(building);


      const buildingUpdated = await this.buildingSchema.updateOne(
        { domainId: building.id.toValue() }, // find the buildings by Id 
        { $set: rawBuilding } //  update the data of Buildings 
      );


      return building;

    } catch (err) {
      return null
    }


    return
  }
}
