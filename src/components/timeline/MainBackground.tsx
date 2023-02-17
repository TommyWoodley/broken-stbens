import { DIVIDER_HEIGHT } from '../../constants/global'
import { css } from '../../styles/stitches.config'
import { Grid } from '../../styles/timeline/main-background.style'

export const MainBackground = ({
  cols,
  rowHeights,
}: {
  cols: number
  rowHeights: { [code: string]: string }
}) => {
  return (
    <Grid css={{ gridTemplateColumns: `repeat(${cols}, 15rem)` }}>
      {[...Array(cols)].map((_, id) => (
        <div key={id} style={{ height: `100%`, borderRadius: '0.5rem', paddingTop: '0.5rem' }}>
          {Object.keys(rowHeights)
            .sort()
            .map((code, index) => {
              const height = rowHeights[code]
              /* NOTE: the computed height of each of the rows is:
               *    [given height (i.e. adjusted to accommodate all the required tracks)] +
               *    [2x padding of tabs (HARDCODED)] +
               *    [height of the divisor line between module tabs]
               * This is so that the heights of rows and Modules tabs align.
               */
              return (
                <div
                  key={index}
                  className={css({
                    height: `calc(${height} + 0.75rem * 2 + ${DIVIDER_HEIGHT})`,
                    backgroundColor: index % 2 === 0 ? '$subtleBackground' : '$appBackground',
                  })()}
                />
              )
            })}
        </div>
      ))}
    </Grid>
  )
}
