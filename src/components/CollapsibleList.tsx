import { Accordion, Item } from '@radix-ui/react-accordion'
import { ReactElement } from 'react'
import { Check, Dash } from 'react-bootstrap-icons'

import { Button, Checkbox, Indicator, Wrapper } from '../styles/_app.style'
import { Content, Header, Trigger } from '../styles/collapsible-list.style'

/**
 * The collapsible behaves like an accordion with an optional checklist.
 * When checklistMode is active, the collapsible reveals a checklist (e.g. outlook or gmail selection). The
 * checklistManager, which the parent component passes in, takes full responsibility of the logic behind managing what
 * items are checked and tracks the global checklist state; for more information, visit lib/checklist.service.tsx. The
 * collapsible is only responsible for rendering the checkbox beside the items and collection headers and invoking the
 * relevant callbacks.
 *
 * NOTE: There's some important terminology to understand. The collapsible "header" identifies a collection while the
 * content identifies the items contained in that collection. The checklist service uses similar terminology.
 *
 * PRE: We expect the data to be organised as one-depth collections of items
 *      See lib/checklist.service.tsx for more information
 *
 * TODO: Make sure that when checklistMode is enabled, the checklistManger isn't undefined!
 */

interface MainAction {
  icon: ReactElement
  action: (item: any) => void
}

export const CollapsibleList = ({
  data,
  contentGenerator,
  headerGenerator,
  collapsed = true,
  checklistMode = false,
  checklistManager = undefined,
  mainItemAction = undefined,
}: {
  data: { [key: string]: object[] }
  contentGenerator: (header: string, group: object[]) => React.ReactNode
  headerGenerator: (header: string, group: object[]) => React.ReactNode
  collapsed?: boolean
  checklistMode?: boolean
  checklistManager?: any
  mainItemAction?: MainAction | undefined
}) => {
  /**
   * NOTE: The checklist attribute is the data attribute that uniquely identifies an item; this is the same attribute
   * used in the checklist service hook that's used as a key of the flat checklist.
   */
  const checklistAttribute: string = checklistManager ? checklistManager.getAttribute() : ''

  /* TODO: Make these style configurable by the user */
  const itemsWrapperStyle = {
    flexGrow: 1,
    borderLeft: '0.0625rem solid $separator',
    padding: '0.5rem 0 0.5rem 0.5rem',
    marginLeft: '1.25rem',
  }
  const checkboxesWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: 'auto',
    minWidth: '1.75rem',
    cursor: 'pointer',
  }

  /* Checkbox generators for both the header (collection-level) and content (item-level) */
  const collectionCheckboxGenerator = (collection: string) => (
    <Checkbox
      checked={
        checklistManager.isIndeterminate(collection)
          ? 'indeterminate'
          : checklistManager.isComplete(collection)
      }
      onCheckedChange={(checked) => checklistManager.onCollectionCheck(collection, checked)}
    >
      {/* When only some but not all items in a collection are checked, we use the indeterminate state (dash) */}
      <Indicator>{checklistManager.isIndeterminate(collection) ? <Dash /> : <Check />}</Indicator>
    </Checkbox>
  )

  const itemCheckboxesGenerator = (collection: string, items: object[]) => (
    <Wrapper css={checkboxesWrapperStyle}>
      {items.map((item: any) => (
        <Checkbox
          checked={checklistManager.getItemState(collection, item[checklistAttribute])}
          onCheckedChange={(checked) =>
            checklistManager.onItemCheck(collection, item[checklistAttribute], checked)
          }
          key={item[checklistAttribute]}
        >
          <Indicator>
            <Check />
          </Indicator>
        </Checkbox>
      ))}
    </Wrapper>
  )

  const mainItemActionGenerator = (collection: string, items: object[]) => {
    return (
      mainItemAction && (
        <Wrapper css={checkboxesWrapperStyle}>
          {items.map((item: any, index) => (
            <Button icon onClick={() => mainItemAction.action(item)} key={`${collection}${index}`}>
              {mainItemAction.icon}
            </Button>
          ))}
        </Wrapper>
      )
    )
  }
  /* TODO: Allow the user to specify a way to calculate the max height and provide styling overrides for Box */
  return (
    <Accordion type="multiple" defaultValue={collapsed ? Object.keys(data) : []}>
      {data &&
        Object.entries(data).map(([collection, items]) => (
          <Item value={collection} key={`${collection}${items.length}`}>
            <Header>
              <Trigger>{headerGenerator(collection, items)}</Trigger>
              {checklistMode && collectionCheckboxGenerator(collection)}
            </Header>
            <Content>
              <Wrapper css={itemsWrapperStyle}>{contentGenerator(collection, items)}</Wrapper>
              {checklistMode && itemCheckboxesGenerator(collection, items)}
              {!checklistMode && mainItemAction && mainItemActionGenerator(collection, items)}
            </Content>
          </Item>
        ))}
    </Accordion>
  )
}
