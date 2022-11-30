import type { Request, Response, NextFunction } from "express";
import AnnotationCollection from "./collection";

/**
 * Checks if the annotation exists
 */
const isAnnotationExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const annotationId = req.body.annotationId as string;

  if (!annotationId) {
    res.status(400).json({ error: `Missing 'annotationId'` });
    return;
  }

  const annotation = await AnnotationCollection.findOne(annotationId);

  if (annotation) {
    next();
  } else {
    res.status(401).json({ error: "Annotation does not exist" });
  }
};

/**
 * Checks if the content of the annotation in req.body is valid, i.e not a stream of empty
 * spaces
 */
const isValidAnnotationContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body as { content: string };
  if (!content.trim()) {
    res.status(400).json({
      error: "Annotation content must be at least one character long.",
    });
    return;
  }
  next();
};

export { isAnnotationExists, isValidAnnotationContent };
