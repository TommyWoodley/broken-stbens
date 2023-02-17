import { ReactNode } from 'react'

import { GroupMember } from './schemas/emarking'

export interface GroupMembersActions {
  deleteMember: (member: GroupMember, asMember?: boolean) => void
  sendInvite: (invitedUsernames: string[]) => void
  answerInvite: (accepted: boolean, memberId: number) => void
  deleteGroup: () => void
}

export interface GroupInviteOption {
  value: string
  label: ReactNode
  available: boolean
}
