import { Fragment, ReactNode } from 'react'

import { DragDropOptions, addDroppable } from '../lib/dragDrop.service'
import { Hr } from '../styles/_app.style'
import { Tab, TabsWrapper } from '../styles/tabs.style'

/**
 * The following was heavily inspired by Emil Kowalski's blog on tabs and the accompanying code sandbox:
 * https://emilkowal.ski/ui/tabs
 * NOTE: The attribute string describes the name of the property in data that uniquely identifies each entry.
 */
export const Tabs = ({
  data,
  generator,
  attribute = 'title',
  href = (_: any) => '#',
  target = '_self',
  dragDropOptions = null,
  dividers = false,
}: {
  data: any
  generator: (_: any) => ReactNode
  attribute?: string
  href?: (tab: any) => string
  target?: string
  dragDropOptions?: DragDropOptions | null
  dividers?: boolean
}) => {
  const renderTab = (tab: any, index: number, props: { [_: string]: any } = {}) => (
    <Fragment key={tab[attribute]}>
      {dividers && index > 0 && <Hr />}
      <Tab {...props} to={href(tab)} target={target}>
        {generator(tab)}
      </Tab>
    </Fragment>
  )

  return (
    <TabsWrapper>
      {dragDropOptions !== null
        ? addDroppable(data, attribute, dragDropOptions, renderTab)
        : data?.map((d: any, i: number) => renderTab(d, i))}
    </TabsWrapper>
  )
}
