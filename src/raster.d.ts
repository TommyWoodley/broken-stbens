import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-grid': React.DetailedHTMLProps<RasterGridAttributes<RasterGridElement>, RasterGridElement>
      'r-cell': React.DetailedHTMLProps<RasterCellAttributes<RasterCellElement>, RasterCellElement>
    }
  }
}

interface RasterGridAttributes<T> extends React.HTMLAttributes<T> {
  columns?: string
  'columns-s'?: string
  'columns-l'?: string
}

interface RasterCellAttributes<T> extends React.HTMLAttributes<T> {
  span?: string
  'span-s'?: string
  'span-l'?: string
}

interface RasterGridElement extends HTMLElement {
  columns: string
  'columns-s': string
  'columns-l': string
}

interface RasterCellElement extends HTMLElement {
  span: string
  'span-s': string
  'span-l': string
}
