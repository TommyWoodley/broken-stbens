import { useParams } from 'react-router-dom'

import { TIMELINE_TRACK_HEIGHT } from '../../constants/global'
import { Wrapper } from '../../styles/_app.style'
import { css } from '../../styles/stitches.config'
import { Module } from '../../types/schemas/abc'
import { Tabs } from '../Tabs'

export const Modules = ({
  modules,
  rowHeights,
}: {
  modules: Module[]
  rowHeights: { [code: string]: string }
}) => {
  const { year } = useParams()
  return (
    <Wrapper
      css={{
        gridArea: 'modules',
        display: 'grid',
        gridGap: '0.5rem',
        padding: '0.5rem',
        paddingBottom: '1rem',
        position: 'sticky',
        left: '0',
        zIndex: '4',
        backgroundColor: '$appBackground',
        borderRight: modules.length > 0 ? '1px solid $elementBorder' : '',
      }}
    >
      <Tabs
        data={modules}
        dividers={modules.length > 1}
        href={(module) => `/${year}/modules/${module.code}/materials`}
        generator={(module: Module) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              height: rowHeights[module.code] ?? TIMELINE_TRACK_HEIGHT,
              /* TODO: Extract constants */
              width: 'calc(16.875rem - 2rem)',
            }}
          >
            <span
              /* TODO: Extract styling */
              className={css({
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                minWidth: '0',
                overflow: 'hidden',
              })()}
            >
              {module.title}
            </span>
            <span className={css({ color: '$lowContrast' })()}>{module.code}</span>
          </div>
        )}
      />
    </Wrapper>
  )
}
