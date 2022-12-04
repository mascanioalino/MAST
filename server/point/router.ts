import type { Request, Response } from "express";
import express from "express";
import PointCollection from "./collection";
import WorkCollection from "../work/collection";
import AnnotationCollection from "../annotation/collection";
import * as curatorValidation from "../curator/middleware";
import * as pointValidator from "./middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Create a point for a work
 *
 * @name POST /api/points
 *
 * @param {number} xLocation - x coordinate of the point
 * @param {number} yLocation - y coordinate of the point
 * @param {string} workId - The work the point is associated with
 * @return {PointResponse} - The created point
 * @throws {400} - Missing work Id
 * @throws {401} - There is already a point at that location
 * TODO add @throws
 */
router.post(
  "/",
  [curatorValidation.isCuratorLoggedIn, pointValidator.isPointDoesNotExist],
  async (req: Request, res: Response) => {
    const point = await PointCollection.addOne(
      req.body.xLocation,
      req.body.yLocation
    );
    const annotation = await AnnotationCollection.addOne(
      req.session.curatorId,
      req.body.content,
      req.body.isPublic
    );
    const annotatedPoint = await PointCollection.addAnnotation(
      point._id,
      annotation
    );
    const work = await WorkCollection.addPoint(req.body.workId, annotatedPoint);
    res.status(201).json({
      message: `You created a new point for ${work._id.toString()}`,
      point: util.constructPointResponse(annotatedPoint),
    });
  }
);

/**
 * Get points by work ID.
 *
 * @name GET /api/points/:workId
 *
 * @return {PointResponse[]} - All points in a work
 * TODO: @throws
 *
 */
router.get(
  "/:workId?",
  // [workValidator.isWorkExists],
  async (req: Request, res: Response) => {
    const work = await WorkCollection.findOne(req.params.workId as string);
    const allPoints = [];
    for (var point of work.points) {
      allPoints.push(await PointCollection.findOne(point._id));
    }
    const response = allPoints.map(util.constructPointResponse);
    res.status(200).json({
      points: response,
    });
  }
);

/**
 * Delete a Point.
 *
 * @name DELETE /api/points/:pointId
 *
 * @return {string} - A success message
 * @throws {400} - If there is no pointId
 * @throws {401} - If the annotations are not empty
 */
router.delete(
  "/:pointId?",
  [pointValidator.isPointExists, pointValidator.noAnnotations],
  async (req: Request, res: Response) => {
    await PointCollection.deleteOne(req.params.pointId);
    res.status(200).json({
      message: "The point has been deleted successfully.",
    });
  }
);

// /**
//  * Get all points
//  *
//  * @name GET /api/points
//  *
//  * @return {PointResponse[]} - An array of all points
//  *
//  */
// router.get("/", async (req: Request, res: Response) => {
//   const allPoints = await PointCollection.();
//   const response = allPoints.map(util.constructPointResponse);
//   res.status(200).json(response);
// });

export { router as pointRouter };
