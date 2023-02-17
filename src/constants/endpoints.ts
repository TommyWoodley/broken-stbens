/**
 * NOTE: For Mac uses on macOS Monterey, the AirPlay Receiver service occupies port 5000. When running materials, please
 * disable it by opening System Preferences, navigating to Sharing and unchecking the AirPlay Receiver service.
 *
 * NOTE: To configure Scientia for testing on mobile devices over the local network, please add a new constant below
 * that's mapped to your device's IP address and temporarily update the baseURL to use this instead of development:
 * const local = 'http://X.X.X.X:5000'
 * Next, start materials (and/or emarking) with the --host 0.0.0.0 argument.
 *
 * TODO: Not verified after latest updates using docker for local development.
 */
export const baseURL = process.env.REACT_APP_API_ENTRYPOINT || 'http://localhost:8080/api'

export const endpoints = {
  login: `${baseURL}/auth/login`,
  logout: `${baseURL}/auth/logout`,
  refresh: `${baseURL}/auth/refresh`,
  personal: (year: string) => `${baseURL}/${year}/personal`,

  modules: (year: string) => `${baseURL}/${year}/modules`,
  module: (year: string, moduleCode: string) => `${baseURL}/${year}/modules/${moduleCode}`,
  enrolledStudents: (year: string, moduleCode: string) =>
    `${baseURL}/${year}/modules/${moduleCode}/enrolled`,
  exercises: (year: string) => `${baseURL}/${year}/exercises`,
  exercise: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/modules/${moduleCode}/exercises/${exerciseNumber}`,
  exerciseMaterials: (year: string, moduleCode: string, exerciseNumber: number, cohort: string) =>
    `/${year}/modules/${moduleCode}/exercises/${exerciseNumber}/materials/${cohort}`,
  submissions: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions`,
  submissionsZipped: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/zipped`,
  submissionZipped: (year: string, moduleCode: string, exerciseNumber: number, username: string) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/${username}/zipped`,
  submissionsForStaff: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/staff`,
  submission: (year: string, moduleCode: string, exerciseNumber: number, submissionId: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/${submissionId}`,
  submissionFile: (
    year: string,
    moduleCode: string,
    exerciseNumber: number,
    submissionId: number
  ) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/${submissionId}/file`,
  submissionWorkload: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/workload`,
  marks: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/marks`,
  mark: (year: string, moduleCode: string, exerciseNumber: number, username: string) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/marks/${username}`,
  enrolledStudentsWithAvailability: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/modules/${moduleCode}/exercises/${exerciseNumber}/group-members-availability`,
  inviteMembers: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/me/${year}/${moduleCode}/exercises/${exerciseNumber}/group/members`,
  groupMember: (year: string, moduleCode: string, exerciseNumber: number, memberUsername: string) =>
    `${baseURL}/me/${year}/${moduleCode}/exercises/${exerciseNumber}/group/members/${memberUsername}`,
  membershipInvitation: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/me/${year}/${moduleCode}/exercises/${exerciseNumber}/group-membership`,
  submissionGroup: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/me/${year}/${moduleCode}/exercises/${exerciseNumber}/group`,
  resources: `${baseURL}/resources`,
  submissionGroups: `${baseURL}/groups`,
  resource: (id: number) => `${baseURL}/resources/${id}`,
  resourcesComplete: `${baseURL}/resources/complete`,
  resourceFileToGet: (id: number, fileName: string) =>
    `${baseURL}/resources/${id}/file/${fileName}`,
  resourceFileToUpdate: (id: number) => `${baseURL}/resources/${id}/file`,
  resourcesArchive: `${baseURL}/resources/zipped`,
  periods: (year: string) => `${baseURL}/${year}/periods`,
  feedback: (year: string) => `${baseURL}/me/${year}/feedback`,
  feedbackFile: (feedbackId: number) => `${baseURL}/feedback/${feedbackId}/file`,
  gameSetting: `${baseURL}/game/setting`,
  enrolments: (year: string) => `${baseURL}/${year}/enrolments`,
  players: `${baseURL}/game/players`,
  moduleCompletions: (year: string) => `${baseURL}/modules/${year}/completion/mean`,
  moduleDatedCompletions: (year: string) => `${baseURL}/modules/${year}/completion/dated`,
}
