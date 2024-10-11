import mongoose from "mongoose";
import {IUserPersistence} from "../../dataschema/IUserPersistence";
import {TaskType} from "../../domain/Tasks/TaskType";
import {ITaskPersistence} from "../../dataschema/ITaskPersistence";


const TaskSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true
    },
    type: {type: String, enum: Object.values(TaskType), required: true},

    //Security
    building: {type: String, index: true},
    floors: [{type: String}],
    emergencyContact: {
      name: { type: String },
      phone: { type: Number }
    },
    //PickUpDelivery
    pickupRoom: {type: String, index: true},
    deliveryRoom: {type: String, index: true},
    pickupContact: {name: {type: String}, phone: {type: Number}},
    deliveryContact: {name: {type: String}, phone: {type: Number}},
    confirmationCode: {type: String, index: true},
    descriptionDelivery: {type: String, index: true},

  });

export default mongoose.model<ITaskPersistence & mongoose.Document>('Task', TaskSchema);
