import type {HydratedDocument, Types} from 'mongoose';
import type {Annotation} from './model';
import AnnotationModel from './model';
import CuratorCollection from '../curator/collection';

/**
 * This files contains a class that has the functionality to explore Annotations
 * stored in MongoDB, including adding, finding, updating, and deleting Annotations.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Annotation> is the output of the AnnotationModel() constructor,
 * and contains all the information in Annotation. https://mongoosejs.com/docs/typescript.html
 */
class AnnotationCollection {
  /**
   * Add a Annotation to the collection
   *
   * @param {string} curator - The id of the author of the Annotation
   * @param {string} content - The id of the content of the Annotation
   * @param {boolean} isPublic - Whether the annptation is public
   * @return {Promise<HydratedDocument<Annotation>>} - The newly created Annotation
   */
  static async addOne(curator: Types.ObjectId | string, content: string, isPublic: boolean): Promise<HydratedDocument<Annotation>> {
    const date = new Date();
    const annotation = new AnnotationModel({
      curator,
      dateCreated: date,
      content,
      isPublic,
      dateModified: date
    });
    await annotation.save(); // Saves annotation to MongoDB
    console.log("annotation:", annotation)
    return annotation.populate('curator');
  }

  /**
   * Find a Annotation by AnnotationId
   *
   * @param {string} annotationId - The id of the Annotation to find
   * @return {Promise<HydratedDocument<Annotation>> | Promise<null> } - The Annotation with the given AnnotationId, if any
   */
  static async findOne(annotationId: Types.ObjectId | string): Promise<HydratedDocument<Annotation>> {
    return AnnotationModel.findOne({_id: annotationId}).populate('curator');
  }

  /**
   * Get all the Annotations in by given author
   *
   * @param {string} username - The username of author of the Annotations
   * @return {Promise<HydratedDocument<Annotation>[]>} - An array of all of the Annotations
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Annotation>>> {
    const curator = await CuratorCollection.findOneByUsername(username);
    return AnnotationModel.find({curator: curator._id}).sort({dateModified: -1}).populate('curator');
  }

  /**
   * Update a Annotation with the new content
   *
   * @param {string} annotationId - The id of the Annotation to be updated
   * @param {string} content - The new content of the Annotation
   * @return {Promise<HydratedDocument<Annotation>>} - The newly updated Annotation
   */
  static async updateOne(annotationId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Annotation>> {
    const annotation = await AnnotationModel.findOne({_id: annotationId});
    annotation.content = content;
    annotation.dateModified = new Date();
    await annotation.save();
    return annotation.populate('curator');
  }

  /**
   * Delete a Annotation with given annotationId.
   *
   * @param {string} annotationId - The annotationId of Annotation to delete
   * @return {Promise<Boolean>} - true if the Annotation has been deleted, false otherwise
   */
  static async deleteOne(annotationId: Types.ObjectId | string): Promise<boolean> {
    const annotation = await AnnotationModel.deleteOne({_id: annotationId});
    return annotation !== null;
  }

  /**
   * Delete all the Annotations by the given author
   *
   * @param {string} curator - The id of author of Annotations
   */
  static async deleteMany(curator: Types.ObjectId | string): Promise<void> {
    await AnnotationModel.deleteMany({curator});
  }
}

export default AnnotationCollection;
