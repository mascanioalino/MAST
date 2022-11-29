import type { HydratedDocument } from "mongoose";
import type { Point } from "./model";

type PointResponse = {
  _id: string;
  xLocation: number;
  yLocation: number;
  annotations: any;
};

/**
 * Transform a raw Point object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Point>} point - A point object
 * @returns {PointResponse} - The point object without the password
 */
const constructPointResponse = (
  point: HydratedDocument<Point>
): PointResponse => {
  const pointCopy: Point = {
    ...point.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  return {
    ...pointCopy,
    _id: pointCopy._id.toString(),
  };
};

export { constructPointResponse };
