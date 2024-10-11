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
  port: parseInt(process.env.PORT, 10) || 4001,

  /**
   * That long string from mlab
   */
  databaseURL:
    process.env.MONGODB_URI ||
    'mongodb+srv://1180562:releasethedrones@cluster0.28yj7at.mongodb.net/taskAPI?retryWrites=true&w=majority',
   // 'mongodb://127.0.0.1:27017/taskAPI',
  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  /**
   * API Communication
   */
  backendAPI:'http://localhost:4000/api',

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: 'RoleController',
      path: '../controllers/roleController'
    },
    taskRequest: {
      name: 'TaskRequestController',
      path: '../controllers/taskRequestController'
    }
  },

  repos: {
    role: {
      name: 'RoleRepo',
      path: '../repos/roleRepo',
    },
    user: {
      name: 'UserRepo',
      path: '../repos/userRepo',
    },
    taskRequest: {
      name: 'taskRequestRepo',
      path: '../repos/taskRequestRepo',
    },
    task: {
      name: 'taskRepo',
      path: '../repos/taskRepo',
    }
  },

  services: {
    role: {
      name: 'RoleService',
      path: '../services/roleService',
    },
    taskRequest: {
      name: 'TaskRequestService',
      path: '../services/taskRequestService',
    },
    http: {
      name: 'HttpRequestService',
      path: '../services/httpRequestService',
    }
  },

};
