import { render, screen } from '@testing-library/react'

import { CollapsibleList } from '../components/CollapsibleList'

describe('GroupedList', () => {
  it.each([
    ['empty data', {}],
    ['one data object', { 'header 1': [] }],
    ['two data objects', { 'header 1': [], 'header 2': [] }],
  ])(`renders an expanded accordion trigger for each header: case with %s`, (_, data) => {
    render(
      <CollapsibleList
        headerGenerator={(header, _) => <span>{header}</span>}
        contentGenerator={() => <></>}
        data={data}
      />
    )
    const headers = Object.keys(data)
    const triggers = screen.queryAllByRole('button', { expanded: true })
    expect(triggers).toHaveLength(headers.length)
  })

  it('renders data headers values as trigger button text', () => {
    const HEADER_TEXT = 'header 1'
    render(
      <CollapsibleList
        headerGenerator={(header, _) => <span>{header}</span>}
        contentGenerator={() => <></>}
        data={{ [HEADER_TEXT]: [] }}
      />
    )
    expect(screen.getByRole('button')).toContainHTML(`<span>${HEADER_TEXT}</span>`)
  })

  it('renders grouped data items as per given generator', () => {
    const generator = (_: string, group: any) => (
      <ul>
        {group.map((g: any, i: number) => (
          <li key={i}>{g.title}</li>
        ))}
      </ul>
    )
    render(
      <CollapsibleList
        headerGenerator={(header, _) => <span>{header}</span>}
        contentGenerator={generator}
        data={{ notes: [{ title: 'slides 1' }, { title: 'slides 2' }] }}
      />
    )
    const listItems = screen.queryAllByRole('listitem')
    expect(listItems).toHaveLength(2)
    listItems.forEach((li) => expect(li.innerHTML).toMatch(/slides \d/))
  })
})
