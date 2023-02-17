import { Expose, Type } from 'class-transformer'

import { endpoints } from '../../constants/endpoints'

// These are the classes used to marshall data from the emarking API

export class CandidateGroupMember {
  id: number
  login: string
  available: boolean
  firstname: string
  lastname: string

  get fullname(): string {
    return this.firstname + ' ' + this.lastname
  }
}

export class GroupMember {
  id: number
  username: string

  @Expose({ name: 'is_leader' })
  isLeader: boolean

  invited: string | null
  accepted: string | null

  get role(): string {
    return this.isLeader ? 'leader' : this.accepted ? 'member' : 'invited'
  }

  get isConfirmed(): boolean {
    return this.isLeader || !!this.accepted
  }

  fullName(enrolledStudents: CandidateGroupMember[]): string {
    return (
      enrolledStudents.find((person: CandidateGroupMember) => person.login === this.username)
        ?.fullname ?? ''
    )
  }
}

export class Group {
  id: number
  year: string

  @Type(() => GroupMember)
  members: GroupMember[]

  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  @Expose({ name: 'module_code' })
  moduleCode: string

  get leader(): string | null {
    return this.members.find((m) => m.isLeader)?.username ?? null
  }

  getMember(login: string): GroupMember | undefined {
    return this.members.find((m) => m.username === login)
  }

  isMember(login: string): boolean {
    return this.members.some((member) => member.username === login)
  }
}

export class Mark {
  student_username: string
  marker: string
  mark: number
}

export class ExerciseSubmission {
  username: string
  id: number
  year: string

  @Type(() => Date)
  timestamp: Date
  @Expose({ name: 'target_submission_file_name' })
  targetFileName: string
  @Expose({ name: 'file_size' })
  fileSize: number

  @Expose({ name: 'module_code' })
  moduleCode: string
  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  @Expose({ name: 'gitlab_hash' })
  gitlabHash: string

  get url(): string {
    return endpoints.submissionFile(this.year, this.moduleCode, this.exerciseNumber, this.id)
  }
}

export class Feedback {
  id: number
  year: string

  @Expose({ name: 'module_code' })
  moduleCode: string

  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  @Expose({ name: 'timestamp' })
  timestamp: Date | null
}
