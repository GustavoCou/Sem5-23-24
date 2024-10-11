import { IBridgePersistence } from "../../dataschema/IBridgePersistence";
import mongoose from "mongoose";

// n

const BridgePositionSchemaX = new mongoose.Schema({
    posX: { type: Number, index: true },
    posY: { type: Number, index: true }
}, { _id: false }); // Ensure that Mongoose doesn't assign a separate ID to the subdocument

const BridgePositionSchemaY = new mongoose.Schema({
    posX: { type: Number, index: true },
    posY: { type: Number, index: true }
}, { _id: false }); // Ensure that Mongoose doesn't assign a separate ID to the subdocument


const Bridge = new mongoose.Schema(
    {
        bridgePositionX: BridgePositionSchemaX,
        bridgePositionY: BridgePositionSchemaY,
        bridgeId: { type: String, required: true },
        floorIdX: { type: String, required: true },
        floorIdY: { type: String, required: true },
        buildingX: { type: String, required: true },
        buildingY: { type: String, required: true }

    },
    { timestamps: true },
);

export default mongoose.model<IBridgePersistence & mongoose.Document>('Bridge', Bridge);