import type {Request, Response} from 'express';
import express from 'express';
import CuratorCollection from './collection';
import * as curatorValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/curators/session
 *
 * @param {string} username - The curators's username
 * @param {string} password - The curators's password
 * @return {UserResponse} - An object with curators's details
 * @throws {403} - If curators is already signed in
 * @throws {400} - If username or password is not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the curators login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    curatorValidator.isCuratorLoggedOut,
    curatorValidator.isValidUsername,
    curatorValidator.isValidPassword,
    curatorValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const curator = await CuratorCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.curatorId = curator._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      curator: util.constructCuratorResponse(curator)
    });
  }
);

/**
  * Get the signed in curator
  * TODO: may need better route and documentation
  * (so students don't accidentally delete this when copying over)
  *
  * @name GET /api/curators/session
  *
  * @return - currently logged in curator, or null if not logged in
  */
router.get(
  '/session',
  [],
  async (req: Request, res: Response) => {
    const curator = await CuratorCollection.findOneByCuratorId(req.session.curatorId);
    res.status(200).json({
      message: 'Your session info was found successfully.',
      curator: curator ? util.constructCuratorResponse(curator) : null
    });
  }
);

/**
 * Sign out a curator
 *
 * @name DELETE /api/curators/session
 *
 * @return - None
 * @throws {403} - If curator is not logged in
 *
 */
router.delete(
  '/session',
  [
    curatorValidator.isCuratorLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.curatorId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a curator account.
 *
 * @name POST /api/curators
 *
 * @param {string} username - username of curator
 * @param {string} password - curator's password
 * @return {CuratorResponse} - The created curator
 * @throws {403} - If there is a curator already logged in
 * @throws {409} - If username or email is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    curatorValidator.isCuratorLoggedOut,
    curatorValidator.isValidUsername,
    curatorValidator.isUsernameNotAlreadyInUse,
    curatorValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const curator = await CuratorCollection.addOne(req.body.username, req.body.password);
    req.session.curatorId = curator._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${curator.username}`,
      curator: util.constructCuratorResponse(curator)
    });
  }
);

/**
 * Update a curators's profile.
 *
 * @name PUT /api/curators
 *
 * @param {string} userDetails the updated curator info
 * @return {CuratorResponse} - The updated curator
 * @throws {403} - If curator is not logged in
 * @throws {409} - If username or email already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    curatorValidator.isCuratorLoggedIn,
    curatorValidator.isValidUsername,
    curatorValidator.isUsernameNotAlreadyInUse,
    curatorValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const curatorId = (req.session.curatorId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const curator = await CuratorCollection.updateOne(curatorId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructCuratorResponse(curator)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/curators
 *
 * @return {string} - A success message
 * @throws {403} - If the curator is not logged in
 */
router.delete(
  '/',
  [
    curatorValidator.isCuratorLoggedIn
  ],
  async (req: Request, res: Response) => {
    const curatorId = (req.session.curatorId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await CuratorCollection.deleteOne(curatorId);
    req.session.curatorId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Get all curators
 *
 * @name GET /api/curators
 *
 * @return {CuratorResponse[]} - An array of all curators
 *
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const allCurators = await CuratorCollection.findAll();
    const response = allCurators.map(util.constructCuratorResponse);
    res.status(200).json(response);
  }
);

/**
 * Get curator with username
 *
 * @name GET /api/curators/:username
 *
 * @return {CuratorReponse} - Curator
 *
 */
router.get(
  '/:username',
  [
    curatorValidator.isUsernameExists
  ],
  async (req: Request, res: Response) => {
    const curator = await CuratorCollection.findOneByUsername(req.params.username);
    const response = util.constructCuratorResponse(curator);
    res.status(200).json(response);
  }
);

export {router as curatorRouter};
