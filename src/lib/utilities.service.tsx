import { utcToZonedTime } from 'date-fns-tz'

import { LONDON_TIMEZONE } from '../constants/global'

/* A file to store miscellaneous utility functions */

/** @returns the current datetime in London */
export const now = (): Date => utcToZonedTime(new Date(), LONDON_TIMEZONE)

