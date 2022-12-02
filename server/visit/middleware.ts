import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import VisitCollection from "./collection";
import * as util from "./util";

/**
 * Checks if there is no session active for a user that is currently logged in.
 */
const isNoVisitInSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inProgress = await VisitCollection.findInProgressVisit(
    req.session.curatorId
  );
  console.log("💚 req session", req.session.curatorId);
  console.log(inProgress);

  if (inProgress === null) {
    next();
  } else {
    res.status(413).json({
      error: "A Visit is currently in progress for logged in user.",
    });
    return;
  }
};

/**
 * Checks if there is no session active for a user that is currently logged in.
 */
const isVisitInSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inProgress = await VisitCollection.findInProgressVisit(
    req.session.curatorId
  );

  if (inProgress !== null) {
    next();
  } else {
    res.status(413).json({
      error: "No Visit currently in session for logged in user.",
    });
    return;
  }
};

/**
 * Checks if there is no session active for a user that is currently logged in.
 */
const isVisitExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const visit = await VisitCollection.findVisit(
    req.params.visitId
  );

  if (visit !== null) {
    next();
  } else {
    res.status(404).json({
      error: "Visit does not exist.",
    });
    return;
  }
};

/**
 * Checks if the work is not already in the visit
 */
 const isWorkNotInCurrentVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inProgress = await VisitCollection.findVisit(
    req.session.visitId
  );

  console.log(inProgress);

  const workIds = util.constructVisitResponse(inProgress).works.map((work: { harvardId: string; }) => work.harvardId)
  console.log(workIds);

  if (workIds.includes(req.params.harvardId)) {
    res.status(409).json({
      error: "Work has already been added to visit.",
    });
    return;
  } else {
    next();
  }
};

/**
 * Checks if there is no session active for a user that is currently logged in.
 */
const loggedInUserOwnsVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const visit = await VisitCollection.findVisit(req.params.visitId);

  if (visit.curator._id.toString() === req.session.curatorId) {
    next();
  } else {
    res.status(403).json({
      error: "Logged in user does not own visit.",
    });
    return;
  }
};

export { isNoVisitInSession, loggedInUserOwnsVisit, isVisitInSession, isWorkNotInCurrentVisit, isVisitExists };
