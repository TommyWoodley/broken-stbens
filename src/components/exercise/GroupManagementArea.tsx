import { css } from '@stitches/react'
import { useEffect, useState } from 'react'
import { Trash3Fill } from 'react-bootstrap-icons'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { useUser } from '../../lib/user.context'
import { capitaliseFirstLetter } from '../../lib/utilities.service'
import { Banner, Button } from '../../styles/_app.style'
import { DropdownStyle, MemberName, MemberRole } from '../../styles/exercise/groupSubmission.style'
import { GroupInviteOption, GroupMembersActions } from '../../types/hooks'
import { CandidateGroupMember, Group, GroupMember } from '../../types/schemas/emarking'
import { Tabs } from '../Tabs'
import Dialog from '../dialogs/Dialog'

const EnrolledStudentSelectLabel = ({
  enrolledStudent,
}: {
  enrolledStudent: CandidateGroupMember
}) => {
  const { login, fullname, available } = enrolledStudent
  return (
    <span className={css({ color: available ? '$highContrast' : '$sand9' })()}>
      {fullname} ({login})
    </span>
  )
}

const animatedComponents = makeAnimated()

export const GroupManagementArea = ({
  group,
  enrolledStudents,
  membersActions,
  disabled,
}: {
  group: Group | null
  enrolledStudents: CandidateGroupMember[]
  membersActions: GroupMembersActions
  disabled: boolean
}) => {
  const { userDetails: { login: userLogin } = {} } = useUser()
  const [inviteOptions, setInviteOptions] = useState<GroupInviteOption[]>([])
  const [optionsSelected, setOptionsSelected] = useState<GroupInviteOption[]>([])
  const [userMember, setUserMember] = useState<GroupMember>()
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!(group && userLogin)) return
    setUserMember(group.getMember(userLogin))
  }, [group, userLogin])

  useEffect(() => {
    setInviteOptions(
      enrolledStudents
        .filter(({ login }) => login !== userLogin && !group?.isMember(login))
        .map((student) => ({
          value: `${student.login}-${student.fullname}`,
          label: <EnrolledStudentSelectLabel enrolledStudent={student} />,
          available: student.available,
        }))
    )
  }, [enrolledStudents, group, userLogin])
  const DeleteGroupDialog = ({
    open,
    onOpenChange,
  }: {
    open: boolean
    onOpenChange: (_: boolean) => void
  }) => {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title="Delete group"
        primaryButtonText="Yes, delete"
        secondaryButtonText="No, cancel"
        onPrimaryClick={membersActions.deleteGroup}
      >
        This action will permanently erase your group and any associated file/LabTS submission
        associated to it. Are you sure?
      </Dialog>
    )
  }
  const GroupMemberHeader = ({ member }: { member: GroupMember }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h4 style={{ margin: '0' }}>
          {member.isConfirmed ? 'Your Group' : 'You are invited to this group'}
        </h4>
        {member.isConfirmed ? (
          <Button
            disabled={disabled}
            type="button"
            onClick={() => membersActions.deleteMember(member, true)}
          >
            Leave
          </Button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
            <Button type="button" onClick={() => membersActions.answerInvite(true, member.id)}>
              Accept
            </Button>
            <Button type="button" onClick={() => membersActions.answerInvite(false, member.id)}>
              Decline
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (!(group && userMember)) return <Banner center>Loading...</Banner>

  return (
    <>
      <div>
        {userMember.isLeader ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h4>Your Group</h4>
            <Button
              disabled={disabled}
              type="button"
              onClick={() => setDeleteGroupDialogOpen(true)}
            >
              Delete group
            </Button>
          </div>
        ) : (
          <GroupMemberHeader member={userMember} />
        )}
        <div
          style={{ display: 'flex', flexDirection: 'row', gap: '0.75rem', marginBottom: '1rem' }}
        >
          <div
            style={{
              flexGrow: 1,
              borderLeft: '0.0625rem solid $separator',
            }}
          >
            <Tabs
              attribute={'id'}
              data={group.members.sort((m1, m2) => m1.id - m2.id)}
              generator={(member: GroupMember) => (
                <>
                  <MemberName>
                    {member.fullName(enrolledStudents)} ({member.username})
                  </MemberName>
                  <MemberRole>{capitaliseFirstLetter(member.role)}</MemberRole>
                </>
              )}
            />
          </div>
          {group.leader === userLogin && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: 'auto',
                minWidth: '1.75rem',
                cursor: 'pointer',
              }}
            >
              {group.members.map((member: GroupMember, index) =>
                !member.isLeader ? (
                  <Button
                    disabled={disabled}
                    type="button"
                    icon
                    onClick={() => membersActions.deleteMember(member)}
                    key={index}
                  >
                    <Trash3Fill size={20} />
                  </Button>
                ) : (
                  <div style={{ height: '2.75rem' }} key={index}></div>
                )
              )}
            </div>
          )}
        </div>

        {group.leader === userLogin && (
          <div
            style={{
              display: 'inline-flex',
              width: '100%',
              justifyContent: 'space-between',
              verticalAlign: 'middle',
              alignItems: 'center',
            }}
          >
            <Select
              styles={DropdownStyle}
              options={inviteOptions}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              value={optionsSelected}
              isOptionDisabled={(option: any) => !option.available}
              onChange={(options: any) => setOptionsSelected(options)}
            />

            <Button
              type="button"
              onClick={() => {
                membersActions.sendInvite(
                  optionsSelected.map((option) => option.value.split('-')[0])
                )
                setOptionsSelected([])
              }}
              disabled={optionsSelected.length === 0}
            >
              Invite to group
            </Button>
          </div>
        )}
      </div>

      <DeleteGroupDialog open={deleteGroupDialogOpen} onOpenChange={setDeleteGroupDialogOpen} />
    </>
  )
}

export const DefaultGroupArea = ({ onCreateGroup }: { onCreateGroup: () => void }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      <Banner center>
        <b>This is a group exercise and you are currently not in a group.</b>
        Wait for another student to invite you as member of an existing group <br />
        or create a new one as leader.
      </Banner>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button type="button" onClick={onCreateGroup}>
          Create group
        </Button>
      </div>
    </div>
  )
}
