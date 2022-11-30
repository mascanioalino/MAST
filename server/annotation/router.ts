import type { Request, Response } from "express";
import express from "express";
import PointCollection from "../point/collection";
import WorkCollection from "../work/collection";
import AnnotationCollection from "./collection";
import * as curatorValidator from "../curator/middleware";
import * as annotationValidator from './middleware';
// import * as pointValidator from "./middleware";
import * as util from "./util";

const router = express.Router();


/**
 * Add an annotation to a point
 *
 * @name POST /api/annotations
 *
 * @param {string} content - Text based content of the annotation
 * @param {boolean} isPublic - Whether the annotation is publically visible or not
 * @param {string} pointId - The point the annotation is associated with
 * @return {AnnotationResponse} - The created annotation
 * @throws {400} - Missing pointId
 * TODO add @throws
 */
 router.post(
    "/",
    [
      curatorValidator.isCuratorLoggedIn,
      annotationValidator.isValidAnnotationContent
    ],
    async (req: Request, res: Response) => {
      const annotation = await AnnotationCollection.addOne(req.session.curatorId, req.body.content, req.body.isPublic); 
      const point = await PointCollection.addAnnotation(req.body.pointId, annotation);
      res.status(201).json({
        message: `You created a new annotation for Point Id: ${point._id.toString()}`,
        annotation: util.constructAnnotationResponse(annotation),
      });
    }
  );


/**
 * Modify an annotation
 *
 * @name PATCH /api/annotations/:annotationId
 *
 * @param {string} content - the new content for the annotation
 * @return {AnnotationResponse} - the updated annotation
 * @throws {403} - if the curator is not logged in 
 * @throws {404} - If the curator is not the author of
 *                 of the annotation
 * @throws {400} - If the annotationId is missing
 * @throws {401} - If the annotation does not exist
 * @throws {413} - If the annotation content is empty
 */
 router.patch(
    '/:annotationId?',
    [
      curatorValidator.isCuratorLoggedIn,
      annotationValidator.isValidAnnotationModifier,
      annotationValidator.isAnnotationExists,
      annotationValidator.isValidAnnotationContent
    ],
    async (req: Request, res: Response) => {
      const annotation = await AnnotationCollection.updateOne(req.params.annotationId, req.body.content);
      res.status(200).json({
        message: 'Your annotation was updated successfully.',
        annotation: util.constructAnnotationResponse(annotation)
      });
    }
  );

/**
 * Delete an annotation
 *
 * @name DELETE /api/annotations/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the curator is not logged in 
 * @throws {404} - If the curator is not the author of
 *                 of the annotation
 * @throws {404} - If the annotationId is not valid
 * @throws {400} - If the annotationId is missing
 * @throws {401} - If the annotation does not exist
 */
 router.delete(
    '/:annotationId?',
    [
      curatorValidator.isCuratorLoggedIn,
      annotationValidator.isValidAnnotationModifier,
      annotationValidator.isAnnotationExists,
    ],
    async (req: Request, res: Response) => {
      await AnnotationCollection.deleteOne(req.params.annotationId);
      res.status(200).json({
        message: 'Your annotation was deleted successfully.'
      });
    }
  );

  export { router as annotationRouter };

