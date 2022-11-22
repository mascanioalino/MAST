import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Work, PopulatedWork } from "../work/model";

// Update this if you add a property to the Work type!
type WorkResponse = {
  _id: string;
  harvardId: String;
  harvardInfo: any;
  points: any;
  dateCreated: string;
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
 * Transform a raw Work object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Work>} work - A work
 * @returns {WorkResponse} - The work object formatted for the frontend
 */
const constructWorkResponse = (work: HydratedDocument<Work>): WorkResponse => {
  const workCopy: PopulatedWork = {
    ...work.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  return {
    ...workCopy,
    _id: workCopy._id.toString(),
    harvardInfo: null,
    dateCreated: formatDate(work.dateCreated),
  };
};

export { constructWorkResponse };
