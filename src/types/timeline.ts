/* A track is a list of non-overlapping exercises */
import { Exercise } from './schemas/abc'

export type Track = Exercise[]

/* A track map associates a list of tracks with a module code */
export type TrackMap = { [code: string]: Track[] }
