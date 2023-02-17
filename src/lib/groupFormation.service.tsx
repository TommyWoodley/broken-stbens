import { instanceToPlain, plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { GroupMembersActions } from '../types/hooks'
import { Exercise } from '../types/schemas/abc'
import { CandidateGroupMember, Group, GroupMember } from '../types/schemas/emarking'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { errorMessage } from './utilities.service'

export const useGroup = (exercise: Exercise | undefined) => {
  const axiosInstance = useContext(AxiosContext)
  const { year } = useParams()
  const { addToast } = useToast()
  const [groupIsLoaded, setGroupIsLoaded] = useState<boolean>(false)

  const [group, setGroup] = useState<Group | null>(null)
  useEffect(() => {
    if (!exercise || exercise.submissionType !== 'group') return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissionGroup(year!, exercise.moduleCode, exercise.number),
      })
      .then(({ data }: { data: any }) => {
        setGroup(plainToInstance(Group, data))
      })
      .catch((error) => {
        const message = errorMessage(error)
        if (
          !message?.startsWith('No group exists') &&
          !message?.startsWith('You are not a member of a group')
        )
          addToast({ variant: 'error', title: 'Unable to get group details' })
      })
      .finally(() => setGroupIsLoaded(true))
  }, [addToast, axiosInstance, exercise, year])

  const [enrolledStudents, setEnrolledStudents] = useState<CandidateGroupMember[]>([])
  useEffect(() => {
    if (!exercise || exercise.submissionType !== 'group') return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.enrolledStudentsWithAvailability(
          year!,
          exercise.moduleCode,
          exercise.number
        ),
      })
      .then(({ data }: { data: any }) => {
        setEnrolledStudents(
          data.map((person: any) => plainToInstance(CandidateGroupMember, person))
        )
      })
      .catch((error) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Unable to get list of students enrolled to module' })
      })
  }, [addToast, axiosInstance, exercise, year])

  const deleteMember = (member: GroupMember, asMember: boolean = false) => {
    if (!exercise || !group) return
    axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.groupMember(year!, exercise.moduleCode, exercise.number, member.username),
      })
      .then(() => {
        let deletedMember = group.members.find((m) => m.id === member.id)
        if (asMember) {
          // User is leaving the group: reset the group
          setGroup(null)
          setEnrolledStudents([])
        } else if (deletedMember !== undefined) {
          // Leader is deleting a member: update the group
          setGroup((group) => {
            const newMembers = group!.members.filter((m) => m.id !== member.id)

            // There *must* be a way to avoid (de)serialisation and treat Group as a simple class. Need to dig deeper.
            return plainToInstance(Group, {
              ...instanceToPlain(group),
              members: newMembers.map((m) => instanceToPlain(m)),
            })
          })
          setEnrolledStudents((people) =>
            people.map((person) =>
              person.login === deletedMember!.username
                ? plainToInstance(CandidateGroupMember, { ...person, available: true })
                : person
            )
          )
        }
      })
      .catch((error: any) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Failed to remove the indicated member' })
      })
  }

  const sendInvite = (invitedUsernames: string[]) => {
    if (!exercise || !group) return
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.inviteMembers(year!, exercise.moduleCode, exercise.number),
        data: invitedUsernames.map((username) => ({ username })),
      })
      .then(({ data }: { data: any }) => {
        setGroup((group) => {
          return plainToInstance(Group, {
            ...instanceToPlain(group),
            members: data,
          })
        })
        setEnrolledStudents((people) =>
          people.map((person) =>
            invitedUsernames.includes(person.login)
              ? plainToInstance(CandidateGroupMember, {
                  ...instanceToPlain(person),
                  available: false,
                })
              : person
          )
        )
      })
      .catch((error: any) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Failed to add the indicated member' })
      })
  }

  /**
   * @param accepted Answer invitation with an accept or decline.
   * @param memberId ID of the member to accept/decline.
   */
  const answerInvite = (accepted: boolean, memberId: number) => {
    if (!exercise || !group) return
    axiosInstance
      .request({
        method: 'PATCH',
        url: endpoints.membershipInvitation(year!, exercise.moduleCode, exercise.number),
        params: { accepted },
      })
      .then(() => {
        if (accepted) {
          setGroup((group) => {
            let currMembers = group!.members
            let newMembers = !accepted
              ? currMembers.filter((member) => member.id !== memberId)
              : currMembers.map((member) => {
                  return member.id === memberId
                    ? { ...instanceToPlain(member), accepted: new Date().toJSON() }
                    : instanceToPlain(member)
                })
            return plainToInstance(Group, {
              ...instanceToPlain(group),
              members: newMembers,
            })
          })
        } else {
          setGroup(null)
          setEnrolledStudents([])
        }
      })
      .catch((error: any) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Failed to update status of membership invite' })
      })
  }

  const createGroup = () => {
    if (!exercise) return
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissionGroups,
        data: {
          year,
          module_code: exercise.moduleCode,
          exercise_number: exercise.number,
        },
      })
      .then(({ data }: { data: any }) => setGroup(plainToInstance(Group, data)))
      .catch((error) => {
        console.log(error)
        addToast({ variant: 'error', title: 'Failed to create a group' })
      })
  }

  const deleteGroup = () => {
    if (!exercise || !group) return

    axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.submissionGroup(year!, exercise.moduleCode, exercise.number),
      })
      .then(() => {
        setGroup(null)
        addToast({ variant: 'success', title: 'The group was deleted' })
      })
      .catch((error) => {
        console.error(error)
        addToast({ variant: 'error', title: 'Unable to delete group' })
      })
  }

  const membersActions: GroupMembersActions = {
    deleteMember,
    sendInvite,
    answerInvite,
    deleteGroup,
  }

  return { groupIsLoaded, enrolledStudents, group, setGroup, createGroup, membersActions }
}
