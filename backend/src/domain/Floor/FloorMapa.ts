import { map, size } from "lodash";
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { read } from "fs";

interface mazeMap{ 
    size: {
        width: number;
        depth: number;
    };
    map: number[][];
    exits: [number, number][];
    elevators: [number, number][];
    exitLocation: [number, number];
};

interface groundMap {
    size: {
        width: number;
        height: number;
        depth: number;
    };
    segments: {
        width: number;
        height: number;
        depth: number;
    };
    primaryColor: string;
    maps: {
        color: {
            url: string;
        };
        ao: {
            url: string;
            intensity: number;
        };
        displacement: {
            url: string;
            scale: number;
            bias: number;
        };
        normal: {
            url: string;
            type: number;
            scale: {
                x: number;
                y: number;
            };
        };
        bump: {
            url: string;
            scale: number;
        };
        roughness: {
            url: string;
            rough: number;
        };
    };
    wrapS: number;
    wrapT: number;
    repeat: {
        u: number;
        v: number;
    };
    magFilter: number;
    minFilter: number;
    secondaryColor: string;
};

interface wallMap  {
    segments: {
        width: number;
        height: number;
    };
    primaryColor: string;
    maps: {
        color: {
            url: string;
        };
        ao: {
            url: string;
            intensity: number;
        };
        displacement: {
            url: string;
            scale: number;
            bias: number;
        };
        normal: {
            url: string;
            type: number;
            scale: {
                x: number;
                y: number;
            };
        };
        bump: {
            url: string;
            scale: number;
        };
        roughness: {
            url: string;
            rough: number;
        };
    };
    wrapS: number;
    wrapT: number;
    repeat: {
        u: number;
        v: number;
    };
    magFilter: number;
    minFilter: number;
    secondaryColor: string;
};

interface playerMap {
    initialPosition: [number, number];
    initialDirection: number;
};

export interface FloorMapProps {
  maze: mazeMap;
  ground: groundMap;
  wall: wallMap;
  player: playerMap
}
  
export class FloorMapa extends ValueObject<FloorMapProps> {
    get maze(): mazeMap {
        return this.props.maze;
    }
    get ground(): groundMap {
        return this.props.ground;
    }
    get wall(): wallMap {
        return this.props.wall;
    }
    get player(): playerMap {
        return this.props.player;
    }
    get map() : FloorMapProps{
        return this.props;
    }
   
    
    constructor(props: FloorMapProps) {
        super(props);
    }
    
    public static create(mazeData: FloorMapProps | undefined): Result<FloorMapa> {    
      if(mazeData == undefined) {
        return Result.ok<FloorMapa>(new FloorMapa({ maze: null ,ground: null,wall: null,player:null }));
      }
        return Result.ok<FloorMapa>(new FloorMapa(mazeData));
    }
}


/**
 * maze:{size: {
                width: 0,
                depth: 0,
              },
              mapper: [],
              exits: [],
              elevators: [],
              exitLocation: [0, 0],
            }, 
            ground:{
                size: {
                    width: 0,
                    height: 0,
                    depth: 0,
                  },
                  segments: {
                    width: 0,
                    height: 0,
                    depth: 0,
                  },
                  primaryColor: "",
                  maps: {
                    color: {
                      url: "",
                    },
                    ao: {
                      url: "",
                      intensity: 0,
                    },
                    displacement: {
                      url: "",
                      scale: 0,
                      bias: 0,
                    },
                    normal: {
                      url: "",
                      type: 0,
                      scale: {
                        x: 0,
                        y: 0,
                      },
                    },
                    bump: {
                      url: "",
                      scale: 0,
                    },
                    roughness: {
                      url: "",
                      rough: 0,
                    },
                  },
                  wrapS: 0,
                  wrapT: 0,
                  repeat: {
                    u: 0,
                    v: 0,
                  },
                  magFilter: 0,
                  minFilter: 0,
                  secondaryColor: "",
                }
            ,wall:{
                segments: {
                    width: 0,
                    height: 0,
                  },
                  primaryColor: "",
                  maps: {
                    color: {
                      url: "",
                    },
                    ao: {
                      url: "",
                      intensity: 0,
                    },
                    displacement: {
                      url: "",
                      scale: 0,
                      bias: 0,
                    },
                    normal: {
                      url: "",
                      type: 0,
                      scale: {
                        x: 0,
                        y: 0,
                      },
                    },
                    bump: {
                      url: "",
                      scale: 0,
                    },
                    roughness: {
                      url: "",
                      rough: 0,
                    },
                  },
                  wrapS: 0,
                  wrapT: 0,
                  repeat: {
                    u: 0,
                    v: 0,
                  },
                  magFilter: 0,
                  minFilter: 0,
                  secondaryColor: "",
                }
            ,player:{
                  initialPosition: [0, 0],
                  initialDirection: 0,
                }
           
 */
/* mazeData.maze.
      const guardResult = Guard.againstNullOrUndefined(mazeData, 'mazeData');

      if(!guardResult.succeeded) {
          return Result.fail<FloorMapa>(guardResult.message);
      }

      for (const row of mazeData.mapper) {
        for (const cell of row) {
          if (cell < 0) {
            return Result.fail("Map cell values must be positive.");
          }
        }
      }
      
      for (const [x, y] of mazeData.exits) {
        if (x < 0 || y < 0) {
          return Result.fail("Exit coordinates must be positive.");
        }
      }
      
      for (const [x, y] of mazeData.elevators) {
        if (x < 0 || y < 0) {
          return Result.fail("Elevator coordinates must be positive.");
        }
      }
      
      const [exitX, exitY] = mazeData.exitLocation;
        if (exitX < 0 || exitY < 0) {
          return Result.fail("Exit location coordinates must be positive.");
        }
      
        for (const room of mazeData.rooms) {
          if (room.width < 0 || room.height < 0 || room.depth < 0) {
            return Result.fail("Room dimensions must be positive.");
          }
        }
 */