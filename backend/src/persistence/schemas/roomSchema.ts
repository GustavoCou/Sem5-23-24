import { IRoomPersistence } from '../../dataschema/IRoomPersistence';
import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
	width: {
		type: Number,
		required: [true, 'Please enter the width'],
		index: true
	},
	depth: {
		type: Number,
		required: [true, 'Please enter the depth'],
		index: true
	}
});

const positionSchema = new mongoose.Schema({
	posX: {
		type: Number,
		required: [true, 'Please enter the posX'],
		index: true
	},
	posY: {
		type: Number,
		required: [true, 'Please enter the posY'],
		index: true
	}
});

const Room = new mongoose.Schema(
	{
		domainId: {
			type: String,
			unique: true
		},

		description: {
			type: String,
			required: [true, 'Please enter first name'],
			index: true
		},

		size: sizeSchema,

		position: positionSchema,

		roomType: {
			type: String,
			required: [true, 'Please enter room type'],
			index: true
		},

		floor: {
			type: String,
			required: [true, 'Please select a building floor'],
			index: true
		}
	},
	{ timestamps: true }
);

export default mongoose.model<IRoomPersistence & mongoose.Document>('Room', Room);