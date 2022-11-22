import type { HydratedDocument, Types } from "mongoose";
import PointCollection from "../point/collection";
import type { Work } from "./model";
import WorkModel from "./model";

/**
 * This files contains a class that has the functionality to explore Works
 * stored in MongoDB, including adding, finding, updating, and deleting Works.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Work> is the output of the WorkModel() constructor,
 * and contains all the information in Work. https://mongoosejs.com/docs/typescript.html
 */
class WorkCollection {
  /**
   * Add a Work to the collection
   *
   * @param {string} harvardId - The object ID to query in the Harvard Art API
   * @param {string} dateCreated - The date the work was created
   * @return {Promise<HydratedDocument<Work>>} - The newly created Work
   */
  static async addOne(
    harvardId: string,
    dateCreated: Date
  ): Promise<HydratedDocument<Work>> {
    const work = new WorkModel({
      harvardId,
      dateCreated,
      points: [],
    });
    await work.save(); // Saves Work to MongoDB
    return work.populate("points");
  }

  /**
   * Find a Work by workId
   *
   * @param {string} workId - The id of the Work to find
   * @return {Promise<HydratedDocument<Work>> | Promise<null> } - The Work with the given workId, if any
   */
  static async findOne(
    workId: Types.ObjectId | string
  ): Promise<HydratedDocument<Work>> {
    return WorkModel.findOne({ _id: workId }).populate("points");
  }

  /**
   * Find a Work by harvardId
   *
   * @param {string} harvardId - The harvardId of the Work to find
   * @return {Promise<HydratedDocument<Work>> | Promise<null> } - The Work with the given workId, if any
   */
  static async findByHarvardId(
    harvardId: Types.ObjectId | string
  ): Promise<HydratedDocument<Work>> {
    return WorkModel.findOne({ harvardId: harvardId }).populate("points");
  }

  /**
   * Update a Work with the new point
   *
   * @param {string} workId - The id of the Work to be updated
   * @param {number} xLocation - The x coordinate of the point on work
   * @param {number} yLocation - The y coordinate of the point on work
   * @return {Promise<HydratedDocument<Work>>} - The newly updated Work
   */
  static async addPoint(
    workId: Types.ObjectId | string,
    xLocation: number,
    yLocation: number
  ): Promise<HydratedDocument<Work>> {
    const point = await PointCollection.addOne(xLocation, yLocation);
    const work = await WorkModel.findOne({ _id: workId });
    work.points.push(point._id);
    await work.save();
    return work.populate("points");
  }

  /**
   * Delete a Work with given workId.
   *
   * @param {string} workId - The workId of Work to delete
   * @return {Promise<Boolean>} - true if the Work has been deleted, false otherwise
   */
  static async deleteOne(workId: Types.ObjectId | string): Promise<boolean> {
    const work = await WorkModel.deleteOne({ _id: workId });
    return work !== null;
  }
}

export default WorkCollection;
