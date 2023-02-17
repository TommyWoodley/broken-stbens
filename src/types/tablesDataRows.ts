export type SubmissionDataRow = {
  login: string
  fullName: string
  latestSubmission: string
  mark: number | string
  subRows?: SubmissionDataRow[]
}
