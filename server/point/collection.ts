import type {HydratedDocument, Types} from 'mongoose';
import AnnotationCollection from 'server/annotation/collection';
import type {Point} from './model';
import PointModel from './model';

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
  static async addOne(xLocation: number, yLocation: number): Promise<HydratedDocument<Point>> {
    const Point = new PointModel({
      xLocation,
      yLocation,
      annotations: []
    });
    await Point.save(); // Saves Point to MongoDB
    return Point.populate('annotations');
  }

  /**
   * Find a Point by pointId
   *
   * @param {string} pointId - The id of the Point to find
   * @return {Promise<HydratedDocument<Point>> | Promise<null> } - The Point with the given pointId, if any
   */
  static async findOne(pointId: Types.ObjectId | string): Promise<HydratedDocument<Point>> {
    return PointModel.findOne({_id: pointId}).populate('annotations');
  }


  /**
   * Update a Point with the new content
   *
   * @param {string} pointId - The id of the Point to be updated
   * @param {string} content - The added annotation content
   * @param {boolean} isPublic - Whether the added annotation is public
   * @return {Promise<HydratedDocument<Point>>} - The newly updated Point
   */
  static async addAnnotation(pointId: Types.ObjectId | string, content: string, curator: Types.ObjectId, isPublic: boolean): Promise<HydratedDocument<Point>> {
    const annotation = await AnnotationCollection.addOne(curator, content, isPublic);
    const point = await PointModel.findOne({_id: pointId});
    point.annotations.push(annotation._id);
    await point.save();
    return point.populate('annotations');
  }

  /**
   * Delete a Point with given pointId.
   *
   * @param {string} pointId - The pointId of Point to delete
   * @return {Promise<Boolean>} - true if the Point has been deleted, false otherwise
   */
  static async deleteOne(pointId: Types.ObjectId | string): Promise<boolean> {
    const point = await PointModel.deleteOne({_id: pointId});
    return point !== null;
  }
}

export default PointCollection;
