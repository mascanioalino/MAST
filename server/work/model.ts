import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { Point } from "../point/model";
/**
 * This file defines the properties stored in a Work
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Work on the backend
export type Work = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  harvardId: String;
  dateCreated: Date;
  points: Types.ObjectId[];
};

export type PopulatedWork = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  harvardId: String;
  dateCreated: Date;
  points: Point[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Works stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const WorkSchema = new Schema<Work>({
  // The object id to query in the Harvard Art API
  harvardId: {
    type: String,
    required: true,
  },
  // The date the Work was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // the points associated with the work
  points: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Point",
  },
});

const WorkModel = model<Work>("Work", WorkSchema);
export default WorkModel;
