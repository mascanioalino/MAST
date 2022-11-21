import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Annotation} from '../annotation/model';

/**
 * This file defines the properties stored in a Point
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Point on the backend
export type Point = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  xLocation: Number;
  yLocation: Number;
  annotations: Types.ObjectId[];
};

export type PopulatedPoint = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  xLocation: Number;
  yLocation: Number;
  annotations: [Annotation];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Points stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PointSchema = new Schema<Point>({
  // The x location of the point on the work
  xLocation: {
    type: Number,
    required: true,
  },
  // The y location of the point on the work
  yLocation: {
    type: Number,
    required: true
  },
  // The annotations associated with the point
  annotations: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Annotation'
  }
});

const PointModel = model<Point>('Point', PointSchema);
export default PointModel;
