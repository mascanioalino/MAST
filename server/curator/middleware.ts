import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CuratorCollection from './collection';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionCuratorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.curatorId) {
    const curator = await CuratorCollection.findOneByCuratorId(req.session.curatorId);

    if (!curator) {
      req.session.curatorId = undefined;
      res.status(500).json({
        error: {
          curatorNotFound: 'Curator session was not recognized.'
        }
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a username in req.body is valid, that is, it matches the username regex
 */
const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test(req.body.username)) {
    res.status(400).json({
      error: {
        username: 'Username must be a nonempty alphanumeric string.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: {
        password: 'Password must be a nonempty string.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a curator with username in req.params exists
 */
const isUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
  const {username} = req.params as {username: string};

  if (!username) {
    res.status(400).json({error: 'Missing username.'});
    return;
  }

  const curator = await CuratorCollection.findOneByUsername(
    username
  );

  if (curator) {
    next();
  } else {
    res.status(401).json({error: 'Invalid curator username provided.'});
  }
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body as {username: string; password: string};

  if (!username || !password) {
    res.status(400).json({error: `Missing ${username ? 'password' : 'username'} credentials for sign in.`});
    return;
  }

  const user = await CuratorCollection.findOneByUsernameAndPassword(
    username, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Invalid curator login credentials provided.'});
  }
};

/**
 * Checks if a username in req.body is already in use
 */
const isUsernameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const curator = await CuratorCollection.findOneByUsername(req.body.username);

  // If the current session user wants to change their username to one which matches
  // the current one irrespective of the case, we should allow them to do so
  if (!curator || (curator?._id.toString() === req.session.curatorId)) {
    next();
    return;
  }

  res.status(409).json({
    error: {
      username: 'An account with this username already exists.'
    }
  });
};

/**
 * Checks if the curator is logged in, that is, whether the curatorId is set in session
 */
const isCuratorLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.curatorId) {
    res.status(403).json({
      error: {
        auth: 'You must be logged in to complete this action.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isCuratorLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.curatorId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

export {
  isCurrentSessionCuratorExists,
  isUsernameNotAlreadyInUse,
  isAccountExists,
  isValidUsername,
  isValidPassword,
  isCuratorLoggedIn,
  isCuratorLoggedOut,
  isUsernameExists
};
