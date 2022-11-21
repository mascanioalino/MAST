import type {HydratedDocument, Types} from 'mongoose';
import type {Curator} from './model';
import CuratorModel from './model';

class CuratorCollection {
  /**
   * Add a new curator
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<Curator>>} - The newly created user
   */
  static async addOne(username: string, password: string): Promise<HydratedDocument<Curator>> {
    const dateJoined = new Date();

    const curator = new CuratorModel({username, password, dateJoined});
    await curator.save();
    return curator;
  }

  /**
   * Find all curators
   *
   * @return {Promise<Array<HydratedDocument<Curator>>>} - Array of all users
   */
  static async findAll(): Promise<Array<HydratedDocument<Curator>>> {
    return CuratorModel.find({});
  }

  /**
   * Find a curator by id.
   *
   * @param {string} curatorId - The id of the curator to find
   * @return {Promise<HydratedDocument<Curator>> | Promise<null>} - The curator with the given id, if any
   */
  static async findOneByCuratorId(curatorId: Types.ObjectId | string): Promise<HydratedDocument<Curator>> {
    return CuratorModel.findOne({_id: curatorId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the curator to find
   * @return {Promise<HydratedDocument<Curator>> | Promise<null>} - The curator with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<Curator>> {
    return CuratorModel.findOne({username: new RegExp(`^${username?.trim()}$`, 'i')});
  }

  /**
   * Find a curator by username (case insensitive) and password.
   *
   * @param {string} username - The username of the curator to find
   * @param {string} password - The password of the curator to find
   * @return {Promise<HydratedDocument<Curator>> | Promise<null>} - The curator with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<Curator>> {
    return CuratorModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update curator's information
   *
   * @param {string} curatorId - The Id of the curator to update
   * @param {Object} userDetails - An object with the curator's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated curator
   */
  static async updateOne(curatorId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<Curator>> {
    const curator = await CuratorModel.findOne({_id: curatorId});
    if (userDetails.username) {
      curator.username = userDetails.username as string;
    }

    if (userDetails.password) {
      curator.password = userDetails.password as string;
    }

    await curator.save();
    return curator;
  }

  /**
   * Delete a curator from the collection.
   *
   * @param {string} curatorId - The Id of curator to delete
   * @return {Promise<Boolean>} - true if the curator has been deleted, false otherwise
   */
  static async deleteOne(curatorId: Types.ObjectId | string): Promise<boolean> {
    const curator = await CuratorModel.deleteOne({_id: curatorId});
    return curator !== null;
  }
}

export default CuratorCollection;
