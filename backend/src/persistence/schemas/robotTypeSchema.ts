import { IRobotTypePersistence } from '../../dataschema/IRobotTypePersistence';
import mongoose from 'mongoose';

const RobotType = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },

        model: {
            type: String,
            required: [true, 'Please enter model'],
            index: true,
        },

        brand: {
            type: String,
            required: [true, 'Please enter brand'],
            index: true,
        },

        tasks: {
            type: String,
            required: [true, 'Please select the tasks'],
            index: true,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IRobotTypePersistence & mongoose.Document>('RobotType', RobotType);
