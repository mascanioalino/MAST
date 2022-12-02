import type { Request, Response, NextFunction } from "express";
import express from "express";
import VisitCollection from "./collection";
import WorkCollection from "../work/collection";
import * as curatorValidation from "../curator/middleware";
import * as workValidator from "../work/middleware";
import * as visitValidator from "./middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Create a visit and set it to be in progress
 *
 * @name POST /api/visits
 *
 * @return {VisitResponse} - The created visit
 * @throws {403} - If there is a visit already logged in
 * @throws {409} - If username or email is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  "/",
  [curatorValidation.isCuratorLoggedIn, visitValidator.isNoVisitInSession],
  async (req: Request, res: Response) => {
    const visit = await VisitCollection.startVisit(req.session.curatorId);
    req.session.visitId = visit._id.toString();
    res.status(201).json({
      message: `You started a new visit for ${visit.dateOfVisit.toString()}`,
      visit: util.constructVisitResponse(visit),
    });
  }
);

/**
 * End a logged in user's current visit
 *
 * @name PUT /api/visits/endCurrentVisit
 *
 * @return {VisitResponse} - The updated visit
 * @throws {403} - If visit is not logged in
 * @throws {409} - If username or email already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  "/current",
  [curatorValidation.isCuratorLoggedIn, visitValidator.isVisitInSession],
  async (req: Request, res: Response) => {
    const visitInProgress = await VisitCollection.findInProgressVisit(
      req.session.curatorId
    );
    const visit = await VisitCollection.endVisit(visitInProgress._id);
    res.status(200).json({
      message: "Visit is no longer in progress",
      user: util.constructVisitResponse(visit),
    });
  }
);

/**
 * Update a current visit with work
 *
 * @name PUT /api/visits/current/works/:harvardId
 *
 * @param {string} harvardId - harvardId of work object
 * @return {VisitResponse} - The updated visit
 * @throws {403} - If visit is not logged in
 * @throws {409} - If username or email already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.patch(
  "/current/works/:harvardId",
  [
    curatorValidation.isCuratorLoggedIn,
    visitValidator.isVisitInSession,
    workValidator.isWorkExists,
    visitValidator.isWorkNotInCurrentVisit
  ],
  async (req: Request, res: Response) => {
    const visit = await VisitCollection.findInProgressVisit(req.session.curatorId);
    const workToAdd = await WorkCollection.findByHarvardId(
      req.params.harvardId
    );
    const updatedVisit = await VisitCollection.addWork(
      visit._id,
      workToAdd._id
    );
    res.status(200).json({
      message: "Work added successfully!",
      user: util.constructVisitResponse(updatedVisit),
    });
  }
);

/**
 * Delete a Visit.
 *
 * @name DELETE /api/visits/:visitId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  "/:visitId",
  [visitValidator.loggedInUserOwnsVisit],
  async (req: Request, res: Response) => {
    await VisitCollection.deleteVisit(req.params.visitId);
    res.status(200).json({
      message: "Your visit has been deleted successfully.",
    });
  }
);

/**
 * Remove a work in a visit.
 *
 * @name DELETE /api/visits/:visitId/works/:harvardId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
 router.delete(
  "/:visitId/works/:harvardId",
  [visitValidator.loggedInUserOwnsVisit],
  async (req: Request, res: Response) => {
    await VisitCollection.removeWork(req.params.visitId, req.params.harvardId);
    res.status(200).json({
      message: "Work has been removed successfully.",
    });
  }
);


/**
 * Get a visits
 *
 * @name GET /api/visits/:visitId
 *
 * @return {VisitResponse} - A visit
 *
 */
 router.get(
  "/:visitId",
  [visitValidator.isVisitExists],
  async (req: Request, res: Response) => {
    const visit = await VisitCollection.findVisit(req.params.visitId);
    const response = util.constructVisitResponse(visit);
    res.status(200).json(response);
  }
)

/**
 * Get visit in session if it exists
 *
 * @name GET /api/visits/:username
 * @return {VisitReponse} - Visit
 *
 */
router.get(
  "/current/session",
  [curatorValidation.isCuratorLoggedIn],
  async (req: Request, res: Response) => {
    const inProgress = await VisitCollection.findInProgressVisit(
      req.session.curatorId
    );
    if (inProgress) {
      const response = util.constructVisitResponse(inProgress);
      res.status(200).json(response);
      return;
    }
    res.status(200).json(inProgress);
  }
);




////////




/**
 * Get all visits
 *
 * @name GET /api/visits
 *
 * @return {VisitResponse[]} - An array of all visits
 *
 */

/**
 * Get visits for curator with `username`
 *
 * @name GET /api/visits/:username
 *
 * @return {VisitReponse} - Visit
 *
 */

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.curatorId !== undefined) {
      next();
      return;
    }

    const allVisits = await VisitCollection.findAll();
    const response = allVisits.map(util.constructVisitResponse);
    res.status(200).json(response);
    return;
  },
  [
    curatorValidation.isQueryCuratorExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const curatorVisits = await VisitCollection.findAllVisitsByCurator(req.query.curatorId as string);
    const response = curatorVisits.map(util.constructVisitResponse);
    res.status(200).json(response);
  }
);




//////////

export { router as visitRouter };
