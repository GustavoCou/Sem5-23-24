import { IBuildingPersistence } from '../../dataschema/IBuildingPersistence';
import mongoose from 'mongoose';

const Building = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },

    name: {
      type: String,
     index: true,
    },

    description: {
      type: String,
     index: true,
    },

    width: 
     {
      type: Number,
      lowercase: true,  
      index: true,
    },
    
    depth: 
     {
      type: Number,
      lowercase: true,  
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', Building);
