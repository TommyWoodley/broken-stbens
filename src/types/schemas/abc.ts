import { Expose, Type } from 'class-transformer'
import { addDays } from 'date-fns'

import cohortMappings from '../../constants/cohortMappings'
import { GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS } from '../../constants/global'

// These are the classes used to marshall data from the emarking API

export class ModuleStaff {
  login: string
  email: string
  firstname: string
  lastname: string
  department: string
  cid: string
}

export class Module {
  code: string
  title: string
  terms: number[]

  @Expose({ name: 'applicable_cohorts' })
  applicableCohorts: string[]

  level?: number

  @Type(() => ModuleStaff)
  staff: ModuleStaff[]
}

export class EnrolledStudent {
  login: string
  email: string
  firstname: string
  lastname: string
  level: number

  get fullName(): string {
    return `${this.firstname} ${this.lastname}`
  }
}

export class Exercise {
  number: number
  title: string
  type: string
  owner: string

  @Expose({ name: 'estimated_work_hours' })
  estimatedWorkHours: number

  @Expose({ name: 'submission_type' })
  submissionType: string
  @Expose({ name: 'is_assessed' })
  isAssessed?: boolean

  @Type(() => Date)
  @Expose({ name: 'start_date' })
  startDate: Date
  @Type(() => Date)
  @Expose({ name: 'end_date' })
  endDate: Date
  @Type(() => Date)
  @Expose({ name: 'extended_end_date' })
  extendedEndDate: Date | null

  @Expose({ name: 'module_code' })
  moduleCode: string
  @Expose({ name: 'module_name' })
  moduleName: string

  @Expose({ name: 'maximum_mark' })
  maximumMark: number
  mark: number | null

  get deadline(): Date {
    return this.extendedEndDate ?? this.endDate
  }

  get latePeriodDeadline(): Date {
    return addDays(this.deadline, GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS)
  }

  get isGroup(): boolean {
    return this.submissionType === 'group'
  }

  get isGroupFormation(): boolean {
    return this.type === 'GF'
  }
}

export class Material {
  name: string
  url: string
}

export class FileRequirement {
  name: string
  max_size: number
}

export class ExerciseMaterials {
  spec: Material | null

  @Expose({ name: 'data_files' })
  dataFiles: Material[]

  @Expose({ name: 'model_answers' })
  modelAnswers: Material[]

  @Expose({ name: 'hand_ins' })
  fileRequirements: FileRequirement[]
}

export class UserDetails {
  login: string
  year: string
  email: string
  cohort: string
  firstname: string
  lastname: string

  @Expose({ name: 'role_in_department' })
  roleInDepartment: string

  @Type(() => Module)
  modules: Module[]

  @Type(() => Module)
  @Expose({ name: 'modules_helped' })
  modulesHelped: Module[]

  get isStaff(): boolean {
    return this.roleInDepartment === 'staff'
  }

  get cohortName(): string | undefined {
    return cohortMappings?.[this.cohort]
  }

  isTaForModule(module: string): boolean {
    return this.roleInDepartment === 'phd' && this.modulesHelped.map((m) => m.code).includes(module)
  }

  get associatedModules(): Module[] {
    return [...this.modules, ...(this.modulesHelped || [])]
  }
}

/**
 * TODO: To turn into a schema
 * The start date's always a Monday and the end date's always a Friday
 * The weeks holds a count of the number of mondays in the term
 */
export type Term = {
  name: string
  start: Date
  end: Date
  weeks: number
}
