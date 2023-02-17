import { Expose, Type } from 'class-transformer'

export class ModuleMeanCompletion {
  title: string

  @Expose({ name: 'mean_completion' })
  meanCompletion: number
}

export class DatedModuleMeanCompletions {
  @Type(() => Date)
  date: Date

  @Type(() => ModuleMeanCompletion)
  @Expose({ name: 'module_mean_completions' })
  moduleMeanCompletions: ModuleMeanCompletion[]
}
