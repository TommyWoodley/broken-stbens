export interface ResourceCreate {
  title: string
  category: string | null
  tags: string[]
  file?: File
  visible_after: Date
  type: string
  path: string
}
