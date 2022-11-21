import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 */

// Type definition for User on the backend
export type Curator = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CuratorSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    required: true
  }
});

const CuratorModel = model<Curator>('Curator', CuratorSchema);
export default CuratorModel;
