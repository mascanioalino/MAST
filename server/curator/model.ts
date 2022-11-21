import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Curator
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Curator on the backend
export type Curator = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Curators stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CuratorSchema = new Schema({
  // The Curator's username
  username: {
    type: String,
    required: true
  },
  // The Curator's password
  password: {
    type: String,
    required: true
  },
  // The date the Curator joined
  dateJoined: {
    type: Date,
    required: true
  }
});

const CuratorModel = model<Curator>('Curator', CuratorSchema);
export default CuratorModel;
