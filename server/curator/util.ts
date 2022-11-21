import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Curator} from './model';

type CuratorResponse = {
  _id: string;
  username: string;
  dateJoined: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructCuratorResponse = (curator: HydratedDocument<Curator>): CuratorResponse => {
  const curatorCopy: Curator = {
    ...curator.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete curatorCopy.password;
  return {
    ...curatorCopy,
    _id: curatorCopy._id.toString(),
    dateJoined: formatDate(curatorCopy.dateJoined)
  };
};

export {
  constructCuratorResponse
};
