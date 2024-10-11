import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://1180562:releasethedrones@cluster0.28yj7at.mongodb.net/?retryWrites=true&w=majority",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController.ts"
    },

    building: {
      name: "buildingController",
      path: "../controllers/buildingController"

    },

    floor: {
      name: "floorController",
      path: "../controllers/floorController"

    },
    elevator: {
      name: "ElevatorController",
      path: "../controllers/elevatorController"
    },

    bridge: {
      name: "BridgeController",
      path: "../controllers/bridgeController"
    },
    robot: {
      name: "robotController",
      path: "../controllers/robotController.ts"
    },
    robotType: {
      name: "robotTypeController",
      path: "../controllers/robotTypeController.ts"
    },

    room: {
      name: "roomController",
      path: "../controllers/roomController"
    },
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo.ts"
    },

    user: {
      name: "UserRepo",
      path: "../repos/userRepo.ts"
    },


    building: {
      name: "BuildingRepo",
      path: "../repos/buildingRepo"

    },

    floor: {
      name: "floorRepo",
      path: "../repos/floorRepo"

    },

    elevator: {
      name: "ElevatorRepo",
      path: "../repos/elevatorRepo"
    },

    bridge: {
      name: "BridgeRepo",
      path: "../repos/bridgeRepo"
    },
    building: {
      name: "BuildingRepo",
      path: "../repos/buildingRepo.ts"
    },

    robot: {
      name: "robotRepo",
      path: "../repos/robotRepo.ts"
    },

    robotType: {
      name: "robotTypeRepo",
      path: "../repos/robotTypeRepo.ts"
    },

    room: {
      name: "RoomRepo",
      path: "../repos/roomRepo"
    },
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService.ts"
    },

    building: {
      name: "BuildingService",
      path: "../services/buildingService"

    },

    floor: {
      name: "floorService",
      path: "../services/floorService"


    },
    elevator: {
      name: "ElevatorService",
      path: "../services/elevatorService"

    },

    bridge: {
      name: "BridgeService",
      path: "../services/bridgeService"
    },
    robot: {
      name: "RobotService",
      path: "../services/robotService.ts"
    },
    robotType: {
      name: "RobotTypeService",
      path: "../services/robotTypeService.ts"
    },

    room: {
      name: "RoomService",
      path: "../services/roomService"
    },
  }
};
