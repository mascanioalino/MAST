import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Curator} from '../curator/model';
import type {Work} from '../work/model';

/**
 * This file defines the properties stored in a Visit
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Visit on the backend
export type Visit = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateOfVisit: Date; // Start of visit 
  curator: Types.ObjectId;
  works: Types.ObjectId[];
  inProgress: boolean;
};

export type PopulatedVisit = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateOfVisit: Date;
  curator: Curator;
  works: Work[];
  inProgress: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Visits stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const VisitSchema = new Schema<Visit>({
  // The author userId
  dateOfVisit: {
    // Use Types.ObjectId outside of the schema
    type: Date,
    required: true
  },
  // The date the Visit was created
  curator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Curator'
  },
  // The content of the Visit
  works: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Work'
  },
  // The date the Visit was modified
  inProgress: {
    type: Boolean,
    required: true
  }
});

const VisitModel = model<Visit>('Visit', VisitSchema);
export default VisitModel;
