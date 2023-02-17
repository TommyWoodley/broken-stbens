import {
  Column,
  ExpandedState,
  Getter,
  Table as ReactTable,
  Row,
  RowData,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { CaretDownFill, CaretRightFill, CaretUpFill, Icon, Trash3Fill } from 'react-bootstrap-icons'
import { useParams } from 'react-router-dom'

import { endpoints } from '../../constants/endpoints'
import { AnchorButton, Button } from '../../styles/_app.style'
import { Input, Table, Td, Th, ThContainer } from '../../styles/table.style'
import { Exercise } from '../../types/schemas/abc'
import { SubmissionDataRow } from '../../types/tablesDataRows'

const DATE_PATTERN = /\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/g

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: string, columnId: keyof SubmissionDataRow, value: string) => void
  }
}

const ActionButtons = ({ deleteMark }: { deleteMark: () => void }) => {
  return (
    <div>
      <Button icon onClick={deleteMark} title={'Delete mark'}>
        <Trash3Fill size={20} />
      </Button>
    </div>
  )
}

const EditableCell = ({
  inputProps,
  getValue,
  row: { id: rowId },
  column: { id: columnId },
  table,
}: {
  inputProps: { [_: string]: string | number }
  getValue: Getter<string>
  row: Row<SubmissionDataRow>
  column: Column<SubmissionDataRow, unknown>
  table: ReactTable<SubmissionDataRow>
}) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const onBlur = () => {
    table.options.meta?.updateData(rowId, columnId as keyof SubmissionDataRow, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Input
      {...inputProps}
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  )
}
const RawSubmissionsTable = ({
  exercise,
  data,
  marksUpdateEnabled,
  updateData,
  onDeleteMark,
}: {
  exercise: Exercise
  data: SubmissionDataRow[]
  marksUpdateEnabled: boolean
  updateData: (oldData: any) => void
  onDeleteMark: (username: string) => () => void
}) => {
  const { year } = useParams()

  function caretIcon(rowIsExpanded: boolean): Icon {
    return rowIsExpanded ? CaretDownFill : CaretRightFill
  }

  const columnHelper = createColumnHelper<SubmissionDataRow>()
  const columns = [
    columnHelper.accessor((row) => {}, {
      id: 'expander',
      cell: ({ row, getValue }) => {
        const Caret = caretIcon(row.getIsExpanded())
        return (
          row.getCanExpand() && (
            <Caret onClick={row.getToggleExpandedHandler()} style={{ cursor: 'pointer' }} />
          )
        )
      },
      header: ({ table }) => {
        const Caret = caretIcon(table.getIsAllRowsExpanded())
        return <Caret onClick={table.getToggleAllRowsExpandedHandler()} />
      },
      enableSorting: false,
    }),
    columnHelper.accessor((row) => row.login, {
      id: 'login',
      cell: (info) => info.getValue(),
      header: 'Login',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.fullName, {
      id: 'fullName',
      cell: (info) => info.getValue(),
      header: 'Name',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.latestSubmission, {
      id: 'latestSubmission',
      cell: (info) => {
        let cellValue = info.getValue()
        return cellValue.match(DATE_PATTERN) ? (
          <AnchorButton
            thin
            href={endpoints.submissionZipped(
              year!,
              exercise.moduleCode,
              exercise.number,
              info.row.original.login
            )}
          >
            {cellValue}
          </AnchorButton>
        ) : (
          cellValue
        )
      },
      header: 'Latest Submission',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.mark, {
      id: 'mark',
      cell: ({ getValue, row, column, table }) => {
        return marksUpdateEnabled ? (
          <EditableCell
            inputProps={{ type: 'number', min: 0, max: exercise.maximumMark }}
            getValue={getValue}
            row={row}
            column={column}
            table={table}
          />
        ) : (
          getValue()
        )
      },
      header: 'Mark',
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.mark, {
      id: 'actions',
      cell: ({ row }) => {
        return <ActionButtons deleteMark={onDeleteMark(row.original.login)} />
      },
      header: 'Actions',
      footer: (info) => info.column.id,
    }),
  ]

  function propagateMark(subRows: SubmissionDataRow[], value: string): SubmissionDataRow[] {
    return subRows.map((subRow: SubmissionDataRow) => {
      return !subRow.mark ? { ...subRow, mark: value } : subRow
    })
  }

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      sorting,
    },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowId: string, columnId: keyof SubmissionDataRow, value) => {
        // Extract main- and sub-row indices from id
        // See https://tanstack.com/table/v8/docs/api/core/table#getrowid
        // NOTE: subRowIndex is NaN if update happens in main row
        const [mainRowIndex, subRowIndex] = rowId.split('.').map((s) => parseInt(s))
        updateData((old: SubmissionDataRow[]) => {
          return old.map((row: SubmissionDataRow, index: number) => {
            // If this is the main row we are looking for...
            if (index === mainRowIndex) {
              // ...and we have updated the main row itself...
              if (isNaN(subRowIndex) && row[columnId] !== value) {
                if (columnId === 'mark') {
                  // Propagate mark of main row to sub rows without one
                  let newSubRows = row.subRows ? propagateMark(row.subRows, value) : row.subRows
                  return { ...row, [columnId]: value, subRows: newSubRows }
                }
                return { ...row, [columnId]: value }
              } else {
                // ...and we have updated a sub row...
                const newSubRows = row.subRows?.map((subRow: SubmissionDataRow, index: number) => {
                  if (subRowIndex === index && subRow[columnId] !== value)
                    return { ...subRow, [columnId]: value }
                  return subRow
                })
                return { ...row, subRows: newSubRows }
              }
            }
            // Not the main row we are looking for.
            return row
          })
        })
      },
    },
  })

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, headerIndex) => (
              <Th key={header.id} expander={headerIndex === 0}>
                {header.isPlaceholder ? null : (
                  <ThContainer
                    {...{
                      className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <CaretUpFill />,
                      desc: <CaretDownFill />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </ThContainer>
                )}
              </Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell, cellIndex) => (
              <Td key={cell.id} expander={cellIndex === 0} subRow={cellIndex > 0 && row.depth > 0}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default RawSubmissionsTable
