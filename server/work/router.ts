import type { NextFunction, Request, Response } from "express";
import express from "express";
import WorkCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get works by author.
 *
 * @name GET /api/works/harvardId
 *
 * @return {WorkResponse[]} - An array of works created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  "/:harvardId",
  //   [workValidator.isHarvardIdExists],
  async (req: Request, res: Response) => {
    // const work = await WorkCollection.findByHarvardId(
    //   req.params.harvardId as string
    // );
    // const response = util.constructWorkResponse(work);

    // add the external harvard info
    const harvardResponse = await fetch(
      `https://api.harvardartmuseums.org/object/${req.params.harvardId}?apikey=${process.env.HARVARD_KEY}`
    );
    const body = await harvardResponse.json();
    console.log(body);
    // response["harvardInfo"] = response;

    res.status(200).json(body);
  }
);

/**
 * Create a new work.
 *
 * @name POST /api/works
 *
 * @param {string} content - The content of the work
 * @return {WorkResponse} - The created work
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the work content is empty or a stream of empty spaces
 * @throws {413} - If the work content is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const work = await WorkCollection.addOne(userId, req.body.content);

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
  [userValidator.isUserLoggedIn],
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
    userValidator.isUserLoggedIn,
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
