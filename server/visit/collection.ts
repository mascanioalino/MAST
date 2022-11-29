import type { HydratedDocument, Types } from "mongoose";
import CuratorCollection from "..//curator/collection";
import type { Visit } from "./model";
import VisitModel from "./model";

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class VisitCollection {
  /**
   * Add a new visit to the collection
   *
   * @param {Types.ObjectId | string} curatorId - The curator who started their visit
   * @return {Promise<HydratedDocument<Visit>>} - The newly started visit
   */
  static async startVisit(
    curatorId: Types.ObjectId | string
  ): Promise<HydratedDocument<Visit>> {
    const date = new Date();
    const visit = new VisitModel({
      dateOfVisit: date,
      curatorId,
      works: [],
      inProgress: true,
    });
    await visit.save();
    return visit.populate("curator");
  }

  /**
   * End this visit
   *
   * @param {Types.ObjectId | string} visitId
   * @returns {Promise<HydratedDocument<Visit>>} - The completed visit
   */
  static async endVisit(
    visitId: Types.ObjectId | string
  ): Promise<HydratedDocument<Visit>> {
    const visit = await VisitModel.findOne({ _id: visitId });
    visit.inProgress = false;
    await visit.save();
    return visit.populate("curator works");
  }

  /**
   * Add a Work to a Visit in progress
   *
   * @param {Types.ObjectId | string} visitId
   * @param {Types.ObjectId} workId
   * @returns {Promise<HydratedDocument<Visit>>}
   */
  static async addWork(
    visitId: Types.ObjectId | string,
    workId: Types.ObjectId
  ): Promise<HydratedDocument<Visit>> {
    const visit = await VisitModel.findOne({ _id: visitId });
    visit.works.push(workId);
    await visit.save();
    return visit.populate("curator works");
  }

  /**
   * Find all visits
   * @returns
   */
  static async findAll(): Promise<Array<HydratedDocument<Visit>>> {
    return VisitModel.find()
      .sort({ dateOfVisit: -1 })
      .populate("curator works");
  }

  /**
   * Find a specific visit by Id
   * {Promise<HydratedDocument<Visit>>}
   * @param {Types.ObjectId | string} visitId
   * @returns {Promise<Array<HydratedDocument<Visit>>>}
   */
  static async findVisit(
    visitId: Types.ObjectId | string
  ): Promise<HydratedDocument<Visit>> {
    return VisitModel.findOne({ _id: visitId }).populate("curator works");
  }

  /**
   * Find all visits by a curator
   * @param curatorId
   * @returns
   */
  static async findAllVisitsByCurator(
    curatorId: string
  ): Promise<Array<HydratedDocument<Visit>>> {
    const curator = await CuratorCollection.findOneByCuratorId(curatorId);
    return VisitModel.find({ curator: curator._id }).populate("curator works");
  }

  /**
   * Get in progress visit for a given curator
   * @param curatorId
   * @returns Visit if in progress, None if none
   */
  static async findInProgressVisit(
    curatorId: string
  ): Promise<HydratedDocument<Visit>> {
    const curator = await CuratorCollection.findOneByCuratorId(curatorId);
    return VisitModel.findOne({
      inProgress: true,
      curator: curator._id,
    }).populate("curator works");
  }

  /**
   * Delete the given visit
   *
   * @param {Types.ObjectId | string} visitId
   * @returns {Promise<boolean>} - whether visit was deleted successfully
   */
  static async deleteVisit(visitId: Types.ObjectId | string): Promise<Boolean> {
    const visit = await VisitModel.deleteOne({ _id: visitId });
    return visit !== null;
  }

  /**
   * Delete all visits by a certain curator
   * @param curatorId
   */
  static async deleteAllVisitsByCurator(
    curatorId: Types.ObjectId | string
  ): Promise<void> {
    await VisitModel.deleteMany({ curatorId });
  }
}

export default VisitCollection;
