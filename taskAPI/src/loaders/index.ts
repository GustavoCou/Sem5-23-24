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

  const taskSchema = {
    // compare with the approach followed in repos and services
    name: 'taskSchema',
    schema: '../persistence/schemas/taskSchema',
  };

  const taskRequestSchema = {
    // compare with the approach followed in repos and services
    name: 'taskRequestSchema',
    schema: '../persistence/schemas/taskRequestSchema',
  };

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const taskRequestController = {
    name: config.controllers.taskRequest.name,
    path: config.controllers.taskRequest.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }
  const taskRepo = {
    name: config.repos.task.name,
    path: config.repos.task.path
  }

  const taskRequestRepo = {
    name: config.repos.taskRequest.name,
    path: config.repos.taskRequest.path
  }




  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const taskRequestService = {
    name: config.services.taskRequest.name,
    path: config.services.taskRequest.path
  }

  const httpService = {
    name: config.services.http.name,
    path: config.services.http.path
  }


  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      taskSchema,
      taskRequestSchema
    ],
    controllers: [
      roleController,
      taskRequestController
    ],
    repos: [
      roleRepo,
      userRepo,
      taskRepo,
      taskRequestRepo
    ],
    services: [
      httpService,
      taskRequestService,
      roleService


    ]
  });

  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
