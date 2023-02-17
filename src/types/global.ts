export type LocationState = { next: string }
export type Mapping<K extends string | number | symbol, V> = {
  [_ in K]: V
}
export type RawMarks = Mapping<string, number>

export interface SelectOption {
  value: string
  label: string
}
