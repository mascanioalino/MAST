import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Visit } from "./model";

type VisitResponse = {
  _id: string;
  dateOfVisit: string;
  curator: any;
  works: any;
  inProgress: Boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => {
  let tzDate = date.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  return moment(tzDate).format("MMMM Do[,] YYYY [at] h:mm:ss a");
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructVisitResponse = (
  visit: HydratedDocument<Visit>
): VisitResponse => {
  const visitCopy: Visit = {
    ...visit.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  return {
    ...visitCopy,
    _id: visitCopy._id.toString(),
    dateOfVisit: formatDate(visit.dateOfVisit),
  };
};

export { constructVisitResponse };
