import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { Curator } from "../curator/model";

/**
 * This file defines the properties stored in a Annotation
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Annotation on the backend
export type Annotation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  curator: Types.ObjectId;
  content: String;
  dateCreated: Date;
  isPublic: Boolean;
  dateModified: Date;
};

export type PopulatedAnnotation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  curator: Curator;
  content: String;
  dateCreated: Date;
  isPublic: Boolean;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Annotations stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const AnnotationSchema = new Schema<Annotation>({
  // The curator of the annotation
  curator: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Curator",
  },
  // The content of the Annotation
  content: {
    type: String,
    required: true,
  },
  // The date the Annotation was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // Whether the annotation is public
  isPublic: {
    type: Boolean,
    required: true,
  },
  // The date the Annotation was modified
  dateModified: {
    type: Date,
    required: true,
  },
});

const AnnotationModel = model<Annotation>("Annotation", AnnotationSchema);
export default AnnotationModel;
