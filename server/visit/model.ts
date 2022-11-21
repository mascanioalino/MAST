import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Visit
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Visit on the backend
export type Visit = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

export type PopulatedVisit = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Visits stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const VisitSchema = new Schema<Visit>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the Visit was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the Visit
  content: {
    type: String,
    required: true
  },
  // The date the Visit was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const VisitModel = model<Visit>('Visit', VisitSchema);
export default VisitModel;
