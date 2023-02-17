/**
 * NOTE: We assume that the input data is organised as one-depth collections of items, as visually described below. This
 * restricts nesting in the grouped list. So, constrained by this, we track one-depth collections of checkboxes (aptly
 * named "checklist"); each collection is named and each checkbox in a collection is accompanied by a named key (e.g.
 * the identifier of the external element that it's semantically tied to). BUT, the Checklist type supports infinitely
 * nested checklists!
 *
 * The checklist itself acts as a global checkbox, with the "completed" state that can take up one of three possible
 * values: true, false or indeterminate.
 *
 * data = {
 *   c-1: [{ a-1: ..., ... },  where c-1 is the name of a collection,
 *         { a-1: ..., ... },        a-1 is the name of an attribute
 *         ...
 *        ],
 *   c-2: [...],
 *   ...
 * }
 *
 */
import { CheckedState } from '@radix-ui/react-checkbox'
import { useCallback, useEffect, useState } from 'react'

type Flat = { [key: string]: CheckedState }
type Nest = { [key: string]: Checklist }
type Checklist = Flat | Nest

/* TODO: Update functionality to handle deeply nested checklists */
export default function useChecklist(
  data: { [key: string]: object[] },
  attribute: string,
  value: boolean = false
) {
  const [checklist, setChecklist] = useState<Checklist>({})
  const [checkedState, setCheckedState] = useState<CheckedState>(false)

  /**
   * NOTE: For each collection, we reduce the items (e.g. [{a-1: ..., ...}, ...]) into a checklist that takes the
   * title of the collection (e.g. c-1). We then collect all the collection-specific checklists into a nested one (see
   * the type of Checklist). Also, attribute is the identifier of the external element (e.g. title or id)
   */
  function defaultChecklist(
    data: { [key: string]: object[] },
    attribute: string,
    value: boolean = false
  ): Checklist {
    return Object.fromEntries(
      Object.entries(data).map(([title, items]: [string, object[]]) => {
        /* Generate a collection-specific flat checklist */
        const checklist: Flat = items.reduce(
          (accumulator: Flat, item: any) => ({
            ...accumulator,
            [item[attribute]]: value,
          }),
          {}
        )
        return [title, checklist]
      })
    )
  }

  /* Marks all items in the named checklist (as specified by title) with the provided value */
  function onCollectionCheck(title: string, value: CheckedState) {
    const updatedChecklist: Checklist = {
      ...(checklist as Nest),
      [title]: Object.fromEntries(
        Object.keys(checklist[title]).map((attribute) => [attribute, value])
      ),
    }
    setChecklist(updatedChecklist)
  }

  /* Marks a specific item in the named checklist (as specified by title) with the provided value */
  function onItemCheck(title: string, attribute: string, value: CheckedState) {
    const updatedChecklist: Checklist = {
      ...(checklist as Nest),
      [title]: { ...(checklist[title] as Flat), [attribute]: value },
    }
    setChecklist(updatedChecklist)
  }

  /* Toggle all checklist items between true and false */
  function onToggle() {
    const newCheckedState: boolean = !(checkedState === 'indeterminate' || checkedState)
    setChecklist(defaultChecklist(data, attribute, newCheckedState))
    setCheckedState(newCheckedState)
  }

  /* NOTE: Callbacks are used so that the function's only redefined when checklist changes */
  const isIndeterminate = useCallback(
    (title: string) => {
      if (!Object.keys(checklist).includes(title)) return false
      const values = Object.values(checklist[title])
      return values.some(Boolean) && !values.every(Boolean)
    },
    [checklist]
  )

  const isComplete = useCallback(
    (title: string) => {
      if (!Object.keys(checklist).includes(title)) return false
      return Object.values(checklist[title]).every(Boolean)
    },
    [checklist]
  )

  function getItemState(title: string, attribute: string): CheckedState {
    if (!Object.keys(checklist).includes(title)) return false
    return (checklist[title] as Flat)[attribute]
  }

  function getCheckedState(): CheckedState {
    return checkedState
  }

  function getAttribute(): string {
    return attribute
  }

  function getCheckedItems(): any[] {
    return Object.values(checklist)
      .flatMap(Object.entries)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
  }

  useEffect(() => {
    function recomputeCheckedState(updatedChecklist: Checklist) {
      const values: boolean[] = Object.values(updatedChecklist).flatMap(Object.values)
      const indeterminate: boolean = values.some(Boolean) && !values.every(Boolean)
      const complete: boolean = Object.keys(updatedChecklist).reduce(
        (accumulator: boolean, title: string) => accumulator && isComplete(title),
        true
      )

      const newCheckedState: CheckedState = indeterminate ? 'indeterminate' : complete
      setCheckedState(newCheckedState)
    }
    recomputeCheckedState(checklist)
  }, [checklist, isComplete, isIndeterminate])

  useEffect(() => {
    setChecklist(defaultChecklist(data, attribute, value))
  }, [data, attribute, value])

  return {
    onCollectionCheck,
    onItemCheck,
    isIndeterminate,
    isComplete,
    onToggle,
    getItemState,
    getCheckedState,
    getCheckedItems,
    getAttribute,
  }
}
