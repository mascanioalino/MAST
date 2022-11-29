import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import WorkCollection from './collection';

/**
 * Checks if a work with harvardId is req.params exists
 */
const isWorkExists = async (req: Request, res: Response, next: NextFunction) => {
  const harvardResponse = await fetch(
    `https://api.harvardartmuseums.org/object/${req.params.harvardId}?apikey=${process.env.HARVARD_KEY}`
  );
  const body = await harvardResponse.json();
  if (body.error || !body.title || !body.primaryimageurl) {
    res.status(404).json({
      error: `Work with Harvard ID ${req.params.harvardId} does not exist.`
    });
    return;
  }
  next();
};

export {
  isWorkExists
};
