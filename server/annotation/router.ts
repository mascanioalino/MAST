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
 * @param {string} pointId - The work the point is associated with
 * @return {AnnotationResponse} - The created point
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
 * @name PATCH /api/annotations/:id
 *
 * @param {string} content - the new content for the annotation
 * @return {AnnotationResponse} - the updated annotation
 * @throws {403} - if the curator is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.patch(
    '/:annotationId?',
    [
      curatorValidator.isCuratorLoggedIn,
      annotationValidator.isAnnotationExists,
      annotationValidator.isValidAnnotationContent,
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
 * @throws {403} - If the curator is not logged in or is not the author of
 *                 the annotation
 * @throws {404} - If the annotationId is not valid
 */
 router.delete(
    '/:annotationId?',
    [
      curatorValidator.isCuratorLoggedIn,
      annotationValidator.isAnnotationExists
    ],
    async (req: Request, res: Response) => {
      await AnnotationCollection.deleteOne(req.params.annotationId);
      res.status(200).json({
        message: 'Your annotation was deleted successfully.'
      });
    }
  );

  export { router as annotationRouter };

