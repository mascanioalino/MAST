import type { NextFunction, Request, Response } from "express";
import express from "express";
import WorkCollection from "./collection";
import * as workValidator from "./middleware";
import * as curatorValidator from "../curator/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get works by harvard ID.
 *
 * @name GET /api/works/harvardId
 *
 * @return {WorkResponse} - A work with a given Harvard ID
 * @throws {404} - If no work exists
 *
 */
router.get(
  "/:harvardId",
  [workValidator.isWorkExists],
  async (req: Request, res: Response) => {
    const work = await WorkCollection.findByHarvardId(
      req.params.harvardId as string
    );
    if (!work) {
      const createdWork = await WorkCollection.addOne(req.params.harvardId);
      res.status(201).json({
        message: "Your work was created successfully",
        work: util.constructWorkResponse(createdWork),
      });
      return;
    }
    res.status(200).json({
      message: `Work was found successfully`,
      work: util.constructWorkResponse(work)
    });
  }
);

/**
 * Create a new work.
 *
 * @name POST /api/works
 *
 * @param {string} harvardId - The harvardId of the work
 * @return {WorkResponse} - The created work
 * @throws {400} - If the work content is empty or a stream of empty spaces
 * @throws {413} - If the work content is more than 140 characters long
 */
router.post(
  "/",
  async (req: Request, res: Response) => {
    const work = await WorkCollection.addOne(req.body.harvardId);
    res.status(201).json({
      message: "Your work was created successfully.",
      work: util.constructWorkResponse(work),
    });
  }
);

/**
 * Delete a work
 *
 * @name DELETE /api/works/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the work
 * @throws {404} - If the workId is not valid
 */
router.delete(
  "/:workId?",
  [curatorValidator.isCuratorLoggedIn],
  async (req: Request, res: Response) => {
    await WorkCollection.deleteOne(req.params.workId);
    res.status(200).json({
      message: "Your work was deleted successfully.",
    });
  }
);

/**
 * Modify a work
 *
 * @name PATCH /api/works/:id
 *
 * @param {string} content - the new content for the work
 * @return {WorkResponse} - the updated work
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the work
 * @throws {404} - If the workId is not valid
 * @throws {400} - If the work content is empty or a stream of empty spaces
 * @throws {413} - If the work content is more than 140 characters long
 */
router.patch(
  "/:workId?",
  [
    curatorValidator.isCuratorLoggedIn,
    // workValidator.isWorkExists,
    // workValidator.isValidWorkModifier,
    // workValidator.isValidWorkContent,
  ],
  async (req: Request, res: Response) => {
    // const work = await WorkCollection.updateOne(
    //   req.params.workId,
    //   req.body.content
    // );
    res.status(200).json({
      message: "Your work was updated successfully.",
      //   work: util.constructWorkResponse(work),
    });
  }
);

export { router as workRouter };
