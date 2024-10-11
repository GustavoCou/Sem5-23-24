import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };


  const buildingSchema = {
    // compare with the approach followed in repos and services
    name: 'buildingSchema',
    schema: '../persistence/schemas/buildingSchema',
  };

  const elevatorSchema = {
    name: 'elevatorSchema',
    schema: '../persistence/schemas/elevatorSchema',

  };

  const floorSchema = {
    // compare with the approach followed in repos and services
    name: 'floorSchema',
    schema: '../persistence/schemas/floorSchema',
  };

  const bridgeSchema = {
    name: 'bridgeSchema',
    schema: '../persistence/schemas/bridgeSchema',

  };



  const robotSchema = {
    // compare with the approach followed in repos and services
    name: 'robotSchema',
    schema: '../persistence/schemas/robotSchema',
  };

  const robotTypeSchema = {
    // compare with the approach followed in repos and services
    name: 'robotTypeSchema',
    schema: '../persistence/schemas/robotTypeSchema',
  };


  const roomSchema = {
    // compare with the approach followed in repos and services
    name: 'roomSchema',
    schema: '../persistence/schemas/roomSchema',
  };

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const buildingController = {
    name: config.controllers.building.name,
    path: config.controllers.building.path
  }



  const floorController = {
    name: config.controllers.floor.name,
    path: config.controllers.floor.path
  }
  const elevatorController = {
    name: config.controllers.elevator.name,
    path: config.controllers.elevator.path

  }

  const bridgeController = {
    name: config.controllers.bridge.name,
    path: config.controllers.bridge.path
  }
  const robotController = {
    name: config.controllers.robot.name,
    path: config.controllers.robot.path
  }

  const robotTypeController = {
    name: config.controllers.robotType.name,
    path: config.controllers.robotType.path

  }

  const roomController = {
    name: config.controllers.room.name,
    path: config.controllers.room.path

  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }


  const buildingRepo = {
    name: config.repos.building.name,
    path: config.repos.building.path
  }
  const elevatorRepo = {
    name: config.repos.elevator.name,
    path: config.repos.elevator.path

  }

  const floorRepo = {
    name: config.repos.floor.name,
    path: config.repos.floor.path
  }

  const bridgeRepo = {
    name: config.repos.bridge.name,
    path: config.repos.bridge.path
  }

  const roomRepo = {
    name: config.repos.room.name,
    path: config.repos.room.path
  }

  const robotRepo = {
    name: config.repos.robot.name,
    path: config.repos.robot.path
  }

  const robotTypeRepo = {
    name: config.repos.robotType.name,
    path: config.repos.robotType.path
  }

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const buildingService = {
    name: config.services.building.name,
    path: config.services.building.path
  }



  const floorService = {
    name: config.services.floor.name,
    path: config.services.floor.path
  }

  const elevatorService = {
    name: config.services.elevator.name,
    path: config.services.elevator.path

  }

  const bridgeService = {
    name: config.services.bridge.name,
    path: config.services.bridge.path

  }

  const RobotService = {
    name: config.services.robot.name,
    path: config.services.robot.path
  }

  const RobotTypeService = {
    name: config.services.robotType.name,
    path: config.services.robotType.path

  }

  const roomService = {
    name: config.services.room.name,
    path: config.services.room.path

  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      buildingSchema,
      floorSchema,
      elevatorSchema,
      bridgeSchema,
      robotSchema,
      robotTypeSchema,
      roomSchema
    ],
    controllers: [
      roleController,
      buildingController,

      floorController,
      elevatorController,
      bridgeController,
      robotController,
      robotTypeController,
      roomController
    ],

    repos: [
      roleRepo,
      userRepo,
      buildingRepo,
      floorRepo,
      elevatorRepo,
      bridgeRepo,
      robotRepo,
      robotTypeRepo,
      roomRepo
    ],
    services: [
      roleService,
      buildingService,
      roomService,
      floorService,
      elevatorService,
      bridgeService,
      RobotService,
      RobotTypeService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
