import type { Request, Response, NextFunction } from "express";
import WorkCollection from "../work/collection";
import PointCollection from "./collection";

/**
 * Checks if the point exists
 */
const isPointExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pointId = req.body.pointId as string || req.params.pointId as string;

  if (!pointId) {
    res.status(400).json({ error: `Missing 'pointId'` });
    return;
  }

  const point = await PointCollection.findOne(pointId);

  if (point) {
    next();
  } else {
    res.status(401).json({ error: "Point does not exist" });
  }
};

/**
 * Checks that this point does not already exist on the work
 */
const isPointDoesNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const workId = req.body.workId as string;

  if (!workId) {
    res.status(400).json({ error: `Missing 'workId'` });
    return;
  }

  const work = await WorkCollection.findOne(workId);

  const points = work.points;
  const pointsInCoordinate = await PointCollection.findAllByLocation(
    req.body.xLocation,
    req.body.yLocation
  );
  const found = pointsInCoordinate.some((p) => points.includes(p._id));
  if (!found) {
    next();
  } else {
    res
      .status(401)
      .json({
        error: `Point at coordinate (${req.body.xLocation},${req.body.yLocation}) already exists`,
      });
  }
};

/**
 * Checks that there are no annotations left
 */
const noAnnotations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pointId = req.params.pointId as string;

  if (!pointId) {
    res.status(400).json({ error: `Missing 'pointId'` });
    return;
  }

  const point = await PointCollection.findOne(pointId);

  if (point.annotations.length !== 0) {
    res.status(401).json({ error: `Point ${pointId} stil has annotations` });
  } else {
    next();
  }
};
export { isPointExists, isPointDoesNotExist, noAnnotations };
