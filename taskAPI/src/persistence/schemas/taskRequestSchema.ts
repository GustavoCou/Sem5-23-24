import mongoose from "mongoose";
import {ITaskPersistence} from "../../dataschema/ITaskPersistence";

import {TaskStatus} from "../../domain/TaskRequests/TaskStatus";


const TaskRequestSchema = new mongoose.Schema(
  {
    domainId: {
      type: String,
      unique: true
    },
    requesterUser:  {type: String, index: true},
    robot:  {type: String, index: true},
    task:  {type: String, index: true},
    status: {type: String, enum: Object.values(TaskStatus), required: true},
    date:  {type: Date, index: true},
  });
export default mongoose.model<ITaskPersistence & mongoose.Document>('TaskRequest', TaskRequestSchema);
