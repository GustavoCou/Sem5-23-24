import { expect } from 'chai';

import { Floor, FloorProps } from '../../../src/domain/Floor/Floor';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorSize } from '../../../src/domain/Floor/FloorSize';
import { FloorMapa, FloorMapProps } from '../../../src/domain/Floor/FloorMapa';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { FloorID } from '../../../src/domain/Floor/FloorID';

describe('Floor', () => {
  let validFloorProps: FloorProps;

  beforeEach(() => {
  // Estabeleça propriedades válidas para os testes

  // Criar um prédio existente
  const buildingResult = Building.create({
    name: BuildingName.create('Building A').getValue(),
    description: BuildingDescription.create('Departamento de Eng Informatica').getValue(),
    size: BuildingSize.create(10, 5).getValue(),
  }, BuildingId.create('A').getValue());

  if(buildingResult.isSuccess) {

    const mazeData = FloorMapa.create({
      maze: {
        size: {
          width: 9,
          depth: 5
        },
      map: [ ],
      exits: [ ],
      elevators: [ ],
      exitLocation: [5, 5]
      },
      ground: {
        size: {
          width: 9, 
          height: 5, 
          depth: 3
        },
        segments: {
          width: 1,
          height: 1, 
          depth: 1
        },
        primaryColor: "white",
        maps: {
          color: {
            url: " " 
          },
          ao: {
            url: " ",      
            intensity: 1 
          },
          displacement: {
            url: " ",
            scale: 1,
            bias: 1
          },
          normal: {
            url: " ",
            type: 1,
            scale: {
              x: 9,
              y: 5
            }
          },
          bump: {
            url: " ",
            scale: 1
          },
          roughness: {
            url: " ",
            rough: 1
          }
        },
        wrapS: 1,   
        wrapT: 1,  
        repeat: {
          u: 1,     
          v: 1      
        },
        magFilter: 1,  
        minFilter: 1,  
        secondaryColor: "black"
      },
      wall: {
        segments: {
          width: 1,  
          height: 1
        },
        primaryColor: "gray", 
        maps: {
          color: {
            url: " " 
          },
          ao: {
            url: " ",      
            intensity: 1 
          },
          displacement: {
            url: " ",
            scale: 1,
            bias: 1
          },
          normal: {
            url: " ",
            type: 1,
            scale: {
              x: 9,
              y: 5
            }
          },
          bump: {
            url: " ",
            scale: 1
          },
          roughness: {
            url: " ",
            rough: 1
          }
        },
        wrapS: 1,   
        wrapT: 1,   
        repeat: {
          u: 1,     
          v: 1      
        },
        magFilter: 1,  
        minFilter: 1,  
        secondaryColor: "black" 
      },
      player: {
        initialPosition: [2, 2],  
        initialDirection: 0      
      }
    });

    validFloorProps = {
      floorDescription: FloorDescription.create('Valid Description').getValue(),
      floorSize: FloorSize.create(8, 8).getValue(),
      floorMapa: mazeData.getValue(),
      building: buildingResult.getValue(),
    }
  }
  });


  it('should create a floor instance with valid properties', () => {
    const floorId = FloorID.create('Floor A10').getValue();
    const floorResult = Floor.create(validFloorProps, floorId);

    if (floorResult.isFailure) {
      console.error('Error:', floorResult.errorValue());
    }

    expect(floorResult.isSuccess).to.be.true;

    if (floorResult.isSuccess) {
      const floor = floorResult.getValue();
      expect(floor.id.toString()).to.equal(floorId.id.toValue());
      expect(floor.floorDescription).to.equal(validFloorProps.floorDescription);
      expect(floor.floorSize.depth).to.equal(validFloorProps.floorSize.depth);
      expect(floor.floorSize.width).to.equal(validFloorProps.floorSize.width);
      expect(floor.floorMapa).to.equal(validFloorProps.floorMapa);
      expect(floor.building).to.equal(validFloorProps.building);
    }
  });

  it('should not create a floor instance with invalid properties', () => {
    const floorId = FloorID.create('Floor A10');

    // test to a floor description not allow
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 266; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const floorDescription = FloorDescription.create(result);
    expect(floorDescription.isSuccess).to.be.false;
 
    // test to a floor size not allow max (10 x 10)
    const floorSize = FloorSize.create(20, 20);
    expect(floorSize.isSuccess).to.be.false;

    // test to a no exist building
    const building = BuildingId.create('INVALID_BUILDING_ID');
    expect(building.isSuccess).to.be.false;
  });

  
  it('should set description, and size correctly', async () => {
    const floorId = FloorID.create('Floor A11').getValue();
    const floor = Floor.create(validFloorProps, floorId).getValue();

    // Probar setDescription
    const newValidDescription = 'New Description';
    const setDescriptionResult = await floor.setDescription(newValidDescription);
    expect(setDescriptionResult).to.be.true;
    expect(floor.floorDescription.value).to.equal(newValidDescription.toString());

    // Probar setSize
    const newWidth = 5;
    const newDepth = 9;
    const setSizeResult = await floor.setSize(newWidth, newDepth);
    expect(setSizeResult).to.be.true;
    expect(floor.floorSize.width).to.equal(newWidth);
    expect(floor.floorSize.depth).to.equal(newDepth);
  });
});

