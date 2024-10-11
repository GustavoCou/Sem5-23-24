import { IFloorPersistence } from "../../dataschema/IFloorPersistence";
import mongoose from 'mongoose';

const floorSizeSchema = new mongoose.Schema({
    width: {
        type: Number,
        required: [true, 'Please enter the width'],
        lowercase: true,
        index: true,
    },
    depth: {
        type: Number,
        required: [true, 'Please enter the depth'],
        lowercase: true,
        index: true,
    },
});

const FloorSchema = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },

        floorDescription: {
            type: String,
            required: [true, 'Please enter a small description'],
            maxlength: 250
        },

        floorSize: floorSizeSchema,

        floorMapa: {
            maze: {
              size: {
                width: { type: Number },
                depth: { type: Number },
              },
              map: [[Number]],
              exits: [[Number]],
              elevators: [[Number]],
              exitLocation: [Number, Number],
            },
            ground: {
              size: {
                width: { type: Number },
                height: { type: Number },
                depth: { type: Number },
              },
              segments: {
                width: { type: Number },
                height: { type: Number },
                depth: { type: Number },
              },
              primaryColor: { type: String },
              maps: {
                color: {
                  url: { type: String },
                },
                ao: {
                  url: { type: String },
                  intensity: { type: Number },
                },
                displacement: {
                  url: { type: String },
                  scale: { type: Number },
                  bias: { type: Number },
                },
                normal: {
                  url: { type: String },
                  type: { type: Number },
                  scale: {
                    x: { type: Number },
                    y: { type: Number },
                  },
                },
                bump: {
                  url: { type: String },
                  scale: { type: Number },
                },
                roughness: {
                  url: { type: String },
                  rough: { type: Number },
                },
              },
              wrapS: { type: Number },
              wrapT: { type: Number },
              repeat: {
                u: { type: Number },
                v: { type: Number },
              },
              magFilter: { type: Number },
              minFilter: { type: Number },
              secondaryColor: { type: String },
            },
            wall: {
              segments: {
                width: { type: Number },
                height: { type: Number },
              },
              primaryColor: { type: String },
              maps: {
                color: {
                  url: { type: String },
                },
                ao: {
                  url: { type: String },
                  intensity: { type: Number },
                },
                displacement: {
                  url: { type: String },
                  scale: { type: Number },
                  bias: { type: Number },
                },
                normal: {
                  url: { type: String },
                  type: { type: Number },
                  scale: {
                    x: { type: Number },
                    y: { type: Number },
                  },
                },
                bump: {
                  url: { type: String },
                  scale: { type: Number },
                },
                roughness: {
                  url: { type: String },
                  rough: { type: Number },
                },
              },
              wrapS: { type: Number },
              wrapT: { type: Number },
              repeat: {
                u: { type: Number },
                v: { type: Number },
              },
              magFilter: { type: Number },
              minFilter: { type: Number },
              secondaryColor: { type: String },
            },
            player: {
              initialPosition: [Number, Number],
              initialDirection: { type: Number },
            },
        },
        building: {
            type: String,
            require: [true, 'Please enter a building id'],
        },
    },
    
    {
        timestamps: true
    },
);

export default mongoose.model<IFloorPersistence & mongoose.Document>('Floor', FloorSchema);

/**
 *  floorMapa: {
            mapper: [[Number]],
            exits: [[Number]],
            elevators: [[Number]],
            exitLocation: [Number, Number],
            rooms: [
                {
                    width: Number,
                    height: Number,
                    depth: Number,
                },
            ],
        },
 */