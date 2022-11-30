import type { HydratedDocument } from "mongoose";
import type { Annotation } from "./model";
import moment from "moment";

type AnnotationResponse = {
  _id: string;
  curator: string;
  content: string;
  dateCreated: string;
  isPublic: boolean;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Annotation object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Annotation>} annotation - A annotation object
 * @returns {AnnotationResponse} - The annotation object without the password
 */
const constructAnnotationResponse = (
  annotation: HydratedDocument<Annotation>
): AnnotationResponse => {
  const annotationCopy: Annotation = {
    ...annotation.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };

  return {
    ...annotationCopy,
    _id: annotationCopy._id.toString(),
    curator: annotationCopy.curator._id.toString(),
    dateCreated: formatDate(annotationCopy.dateCreated),
    dateModified: formatDate(annotationCopy.dateModified),
  };
};

export { constructAnnotationResponse };
