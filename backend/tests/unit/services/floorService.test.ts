import { expect } from 'chai';

import { Building, BuildingProps } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingId } from '../../../src/domain/Building/BuildingId';
import FloorService from '../../../src/services/FloorService';
import  IBuildingDTO  from '../../../src/dto/IBuildingDTO';
import { Floor, FloorProps } from '../../../src/domain/Floor/Floor';
import { IFloorDTO } from '../../../src/dto/IFloorDTO';
import IBuildingRepo from '../../../src/services/IRepos/IBuildingRepo';
import Container from 'typedi';
import config from '../../../config';

// Mock IFloorRepo 
export class FloorRepoMock {  
  
  async findByDomainId(id: string): Promise<Boolean> {
    return !!this.floors.find(floor => floor.id === id);
  }

  async save(floor: Floor): Promise<Floor> {

    this.floors.push(floor);

    return floor;
  }

  addFloor(floor: any) {
    this.floors.push(floor);
  }

  private floors: any[] = [];

  async updateOne(floor: Floor): Promise<Floor> {
    // Encontre o índice do piso existente que corresponde ao piso fornecido
    const index = this.floors.findIndex((f) => f.id === floor.id.toString());

    if (index !== -1) {
      // Atualize o piso existente com os valores do piso fornecido
      this.floors[index] = floor;
      return floor;
    } else {
      // Simule o lançamento de uma exceção se o piso não for encontrado
      throw new Error('Floor not found for update');
    }
  }

  public async getFloor(): Promise<Floor[]> {
    throw new Error('Method not implemented.');
  }

  public async findFloorsByBuilding(buildingId: string | BuildingId): Promise<Floor[]> {
    throw new Error('Method not implemented.');
  };
}

// Mock BuildingRepo
class BuildingRepoMock implements IBuildingRepo {
  async save(building: Building): Promise<Building> {
      throw new Error('Method not implemented.');
  }
  findByName(name: string | BuildingName): Promise<Building> {
      throw new Error('Method not implemented.');
  }
  listAll(): Promise<Building[]> {
      throw new Error('Method not implemented.');
  }
  updateOne(building: Building): Promise<Building> {
      throw new Error('Method not implemented.');
  }
  exists(t: Building): Promise<boolean> {
      throw new Error('Method not implemented.');
  }

  private buildings: any[] = [];

  async findById(buildingId: string) {
      const foundBuilding = this.buildings.find(building => building.id === buildingId);
      return foundBuilding;
  }

  public addBuilding(building: any) {

      const mockBuilding = {
          ...building,
          name: BuildingName.create("A1").getValue(),
          description: BuildingDescription.create("Test Building Description").getValue(),
          size: BuildingSize.create(10, 10).getValue()
      };
      this.buildings.push(mockBuilding);
  }
}

describe('FloorService', () => {
  let floorService: FloorService;

  beforeEach(() => {
    const mockFloorRepo = new FloorRepoMock();
    const mockBuildingRepo = new BuildingRepoMock();

    // Adicionar dados fictícios ao BuildingRepoMock
    mockBuildingRepo.addBuilding({ id: "A" });
    mockBuildingRepo.addBuilding({ id: "B" });
    mockBuildingRepo.addBuilding({ id: "C" });

    // Adicionar dados fictícios ao FloorRepoMock
    mockFloorRepo.addFloor({ id: "Floor A10", building: { id: "A" } });
    mockFloorRepo.addFloor({ id: "Floor A11", building: { id: "A" } });
    mockFloorRepo.addFloor({ id: "Floor B1", floorDescription: "Salas T", size: { width: 10, depth: 10 }, building: { id: "B" } });

    mockFloorRepo.addFloor({
      floorId: "Floor A1",
      floorDescription: "Salas T",
      floorSize: {width: 9, depth: 9 },
      floorMapa: {
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
      },
      buildingId: "A"
    })

    Container.set(config.repos.floor.name, mockFloorRepo);
    Container.set(config.repos.building.name, mockBuildingRepo);

    floorService = Container.get(FloorService);
  });

  

  it('should create a floor with valid DTO', async () => {
    const floorDTO: IFloorDTO = {
      id: 'Floor A2',
      floorDescription: 'Test Floor',
      floorSize: {
        width: 10,
        depth: 10,
      },
      floorMapa: {
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
      },
      building: 'A',
    };

    const result = await floorService.createFloor(floorDTO);
    expect(result.isSuccess).to.be.true;
  });

  it('should fail to create a floor if it already exists', async () => {
    const floorDTO1: IFloorDTO = {
      id: 'Floor A11',
      floorDescription: 'Test',
      floorSize: {
        width: 9,
        depth: 9,
      },
      floorMapa: {
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
      },
      building: 'A',
    };

    const result1 = await floorService.createFloor(floorDTO1);
    expect(result1.isSuccess).to.be.false;
    expect(result1.error).to.equal('Floor already exists with id = Floor A11');
  });
});
