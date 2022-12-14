import type { HydratedDocument, Types } from "mongoose";
import AnnotationCollection from "../annotation/collection";
import type { Point } from "./model";
import type { Annotation } from "../annotation/model";
import PointModel from "./model";

/**
 * This files contains a class that has the functionality to explore Points
 * stored in MongoDB, including adding, finding, updating, and deleting Points.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Point> is the output of the PointModel() constructor,
 * and contains all the information in Point. https://mongoosejs.com/docs/typescript.html
 */
class PointCollection {
  /**
   * Add a Point to the collection
   *
   * @param {string} xLocation - The x location on the work the Point is in
   * @param {string} yLocation - The y location on the work the Point is in
   * @return {Promise<HydratedDocument<Point>>} - The newly created Point
   */
  static async addOne(
    xLocation: number,
    yLocation: number
  ): Promise<HydratedDocument<Point>> {
    const point = new PointModel({
      xLocation,
      yLocation,
      annotations: [],
    });
    await point.save(); // Saves Point to MongoDB
    return point.populate("annotations");
  }

  /**
   * Find a Point by pointId
   *
   * @param {string} pointId - The id of the Point to find
   * @return {Promise<HydratedDocument<Point>> | Promise<null> } - The Point with the given pointId, if any
   */
  static async findOne(
    pointId: Types.ObjectId | string
  ): Promise<HydratedDocument<Point>> {
    return PointModel.findOne({ _id: pointId }).populate("annotations");
  }

  /**
   * Find a Point by x and y location
   *
   * @param {number} xLocation - The x coordinate of the point
   * @param {number} yLocation - The y coordinate of the point
   * @return {Promise<Array<HydratedDocument<Point>>> | Promise<null> } - The points with the given (x,y), if any
   */
  static async findAllByLocation(
    xLocation: number,
    yLocation: number
  ): Promise<Array<HydratedDocument<Point>>> {
    return PointModel.find({ xLocation, yLocation });
  }

  /**
   * Find a Point by an annotation
   *
   * @param {string} annotationId - The annotation id of the annotation to look for
   * @return {Promise<HydratedDocument<Point>> | Promise<null> } - The points with the given annotation
   */
  static async findOneByAnnotation(
    annotationId: string
  ): Promise<HydratedDocument<Point>> {
    return (await PointModel.findOne({ annotations: annotationId })).populate(
      "annotations"
    );
  }

  /**
   * Update a Point with the new content
   *
   * @param {string} pointId - The id of the Point to be updated
   * @param {string} content - The added annotation content
   * @param {boolean} isPublic - Whether the added annotation is public
   * @return {Promise<HydratedDocument<Point>>} - The newly updated Point
   */
  static async addAnnotation(
    pointId: Types.ObjectId | string,
    annotation: Annotation
  ): Promise<HydratedDocument<Point>> {
    const point = await PointModel.findOne({ _id: pointId });
    point.annotations.push(annotation._id);
    await point.save();
    return point.populate("annotations");
  }

  /**
   * Delete a Point with given pointId.
   *
   * @param {string} pointId - The pointId of Point to delete
   * @return {Promise<Boolean>} - true if the Point has been deleted, false otherwise
   */
  static async deleteOne(pointId: Types.ObjectId | string): Promise<boolean> {
    const point = await PointModel.deleteOne({ _id: pointId });
    return point !== null;
  }
}

export default PointCollection;
