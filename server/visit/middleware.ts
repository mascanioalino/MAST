import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import VisitCollection from "./collection";

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
      error: "A Visit is currrently in progress for logged in user.",
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
const loggedInUserOwnsVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const visit = await VisitCollection.findVisit(req.params.visitId);

  if (visit.curator._id.toString() === req.session.curatorId.toString()) {
    next();
  } else {
    res.status(403).json({
      error: "Logged in user does not own visit.",
    });
    return;
  }
};

export { isNoVisitInSession, loggedInUserOwnsVisit, isVisitInSession };
