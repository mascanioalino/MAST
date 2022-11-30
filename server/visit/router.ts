import type { Request, Response } from "express";
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
  "/endCurrentVisit",
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
 * @name PUT /api/visits/:harvardId
 *
 * @param {string} harvardId - harvardId of work object
 * @return {VisitResponse} - The updated visit
 * @throws {403} - If visit is not logged in
 * @throws {409} - If username or email already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  "/:harvardId",
  [
    curatorValidation.isCuratorLoggedIn,
    visitValidator.isVisitInSession,
    workValidator.isWorkExists
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
  "/",
  [visitValidator.loggedInUserOwnsVisit],
  async (req: Request, res: Response) => {
    await VisitCollection.deleteVisit(req.params.freetId);
    res.status(200).json({
      message: "Your account has been deleted successfully.",
    });
  }
);

/**
 * Get all visits
 *
 * @name GET /api/visits
 *
 * @return {VisitResponse[]} - An array of all visits
 *
 */
router.get("/", async (req: Request, res: Response) => {
  const allVisits = await VisitCollection.findAll();
  const response = allVisits.map(util.constructVisitResponse);
  res.status(200).json(response);
});

/**
 * Get visit in session if it exists
 *
 * @name GET /api/visits/:username
 * @return {VisitReponse} - Visit
 *
 */
router.get(
  "/session",
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

/**
 * Get visits for curator with `username`
 *
 * @name GET /api/visits/:username
 *
 * @return {VisitReponse} - Visit
 *
 */
router.get("/:curatorId", [], async (req: Request, res: Response) => {
  console.log("🤍", req.params.curatorId);
  const curatorVisits = await VisitCollection.findAllVisitsByCurator(
    req.params.curatorId
  );
  const response = curatorVisits.map(util.constructVisitResponse);
  res.status(200).json(response);
});

export { router as visitRouter };
