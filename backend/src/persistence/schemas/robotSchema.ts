import { IRobotPersistence } from '../../dataschema/IRobotPersistence';
import mongoose from 'mongoose';

const Robot = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },



        serialNumber: {
            type: String,
            required: [true, 'Please enter serial number'],
            unique: true,
            index: true,
        },

        nickName: {
            type: String,
            required: [true, 'Please enter the nickname'],
            index: true,
        },

        description: {
            type: String,
            required: [true, 'Please enter the description'],
            index: true,
        },

        robotTypeId: {
            type: String,
            required: [true, 'Please enter the robot type Id'],
            index: true,
        },
        inhibited:
        {
            type: Boolean,
            required: [true, 'Please enter the inhibition state'],
            index: true,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IRobotPersistence & mongoose.Document>('Robot', Robot);
