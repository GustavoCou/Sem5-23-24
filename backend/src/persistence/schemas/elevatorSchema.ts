import { IElevatorPersistence } from "../../dataschema/IElevatorPersistence";
import mongoose from "mongoose";

// n

const ElevatorPositionSchema = new mongoose.Schema({
    posX: { type: Number, index: true },
    posY: { type: Number, index: true }
}, { _id: false }); // Ensure that Mongoose doesn't assign a separate ID to the subdocument

const Elevator = new mongoose.Schema(
    {
        floorIds: [{ type: String, required: true }],
        elevatorUniqueCodBuilding: { type: Number, required: true },
        elevatorId: { type: String, unique: true, index: true },
        elevatorPosition: ElevatorPositionSchema,
        buildingId: { type: String, required: true },
        elevatorBrand: { type: String, maxlength: 50 },
        elevatorModel: { type: String, maxlength: 50 },
        elevatorSerialNumber: { type: String, maxlength: 50 },
        elevatorDescription: { type: String, maxlength: 250 }
    },
    { timestamps: true },
);

export default mongoose.model<IElevatorPersistence & mongoose.Document>('Elevator', Elevator);