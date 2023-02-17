import { styled } from '../stitches.config'
import { WEEKDAYS_WIDTHS, WEEKEND_WIDTH } from './constants.style'

/* Background layout: general overview */
/* +------------+------------+------------+------------+------------+--------+ */
/* | Week                                                                    | */
/* | Mon          Tue          Wed          Thu          Fri                 | */
/* +------------+------------+------------+------------+------------+--------+ */
/* | <- 3rem -> | <- 3rem -> | <- 3rem -> | <- 3rem -> | <- 3rem -> | 0.5rem | */

// This is the main timeline area
export const Background = styled('div', {
  gridArea: 'background',
  backgroundColor: '$appBackground',
  display: 'grid',
  gridTemplateColumns: `repeat(10, ${WEEKDAYS_WIDTHS} ${WEEKEND_WIDTH})`,
  gridTemplateRows: 'repeat(10, 4rem)',
  padding: '0.5rem',
})
