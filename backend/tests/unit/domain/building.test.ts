import { expect } from 'chai';

import { Building, BuildingProps } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';

describe('Building', () => {
  let validBuildingProps: BuildingProps;

  beforeEach(() => {
    // Establecer propiedades válidas para las pruebas
    validBuildingProps = {
      name: BuildingName.create('Valid Building Name').getValue(),
      description: BuildingDescription.create('Valid Building Description').getValue(),
      size: BuildingSize.create(10, 5).getValue(),
    };
  });

  it('should create a building instance with valid properties', () => {
    const buildingId = BuildingId.create('1421').getValue();
    const buildingResult = Building.create(validBuildingProps, buildingId);

    expect(buildingResult.isSuccess).to.be.true;
    const building = buildingResult.getValue();
    expect(building.id.toString()).to.equal(buildingId.id.toValue());
    expect(building.name).to.equal(validBuildingProps.name.value);
    expect(building.description).to.equal(validBuildingProps.description.value);
    expect(building.width).to.equal(validBuildingProps.size.valueWidth);
    expect(building.depth).to.equal(validBuildingProps.size.valuedDepth);
  });

  it('should not create a building instance with invalid properties', () => {
    const buildingId = BuildingId.create('15645');

    // test to a building name not allow

   var buildname = BuildingName.create("123456789123456789123456789123456789123452226789123456789123456789");
   
    expect(buildname.isSuccess).to.be.false;

    // test to a building description not allow
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 266; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const buildDescription = BuildingDescription.create(result);
    expect(buildDescription.isSuccess).to.be.false;
 
    // test to a building size not allow max (10 x 10)
   const buildSize = BuildingSize.create(20, 20);
    expect(buildSize.isSuccess).to.be.false;
  });

  
  it('should set name, description, and size correctly', async () => {
    const buildingId = BuildingId.create('1524').getValue();
    const building = Building.create(validBuildingProps, buildingId).getValue();

    // Probar setName
    const newValidName = 'New Valid Building Name';
    const setNameResult = await building.setName(newValidName);
    expect(setNameResult).to.be.true;
    expect(building.name).to.equal(newValidName);

    // Probar setDescription
    const newValidDescription = 'New Valid Building Description';
    const setDescriptionResult = await building.setDescription(newValidDescription);
    expect(setDescriptionResult).to.be.true;
    expect(building.description).to.equal(newValidDescription);

    // Probar setSize
    const newWidth = 5;
    const newDepth = 9;
    const setSizeResult = await building.setSize(newWidth, newDepth);
    expect(setSizeResult).to.be.true;
    expect(building.width).to.equal(newWidth);
    expect(building.depth).to.equal(newDepth);
  });
});


