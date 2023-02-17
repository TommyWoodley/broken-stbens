import React, { useEffect } from 'react'

import FileUploadArea from '../components/exercise/FileUploadArea'
import { DefaultGroupArea, GroupManagementArea } from '../components/exercise/GroupManagementArea'
import { GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS } from '../constants/global'
import { useExerciseMaterials } from '../lib/exercise.service'
import { useExerciseForStudent } from '../lib/exerciseForStudent.service'
import { useGroup } from '../lib/groupFormation.service'
import { useUser } from '../lib/user.context'
import { displayTimestamp, now } from '../lib/utilities.service'
import { Banner } from '../styles/_app.style'
import { Deadline, Footer, ProgressBar, UploadWrapper } from '../styles/exercise/exercise.style'
import { Exercise } from '../types/schemas/abc'

const ExerciseStudent = ({ exercise }: { exercise: Exercise }) => {
  const { userDetails } = useUser()
  const { submittedFiles, submitFile, deleteFile, loadSubmittedFiles } =
    useExerciseForStudent(exercise)
  const { spec, fileRequirements } = useExerciseMaterials()
  const { groupIsLoaded, enrolledStudents, group, createGroup, membersActions } = useGroup(exercise)

  useEffect(() => {
    if (!exercise) return
    loadSubmittedFiles()
  }, [exercise, group, loadSubmittedFiles])

  function studentIsLeader(): boolean {
    return exercise.submissionType === 'individual' || group?.leader === userDetails?.login
  }

  function exerciseIsOpen(): boolean {
    // This is admittedly a hack, but gets easily around the pure date comparison
    // limitations (which would make dev interactions cumbersome)
    const appIsRunningInDev = process.env.NODE_ENV === 'development'
    const isWithinExercisePeriod = now() < exercise.latePeriodDeadline && now() > exercise.startDate
    return !userDetails?.isStaff && (appIsRunningInDev || isWithinExercisePeriod)
  }

  const SubmissionUploadAvailabilityWarning = () => {
    if (now() < exercise.latePeriodDeadline)
      return (
        <Banner center level={'warning'}>
          <p>
            Your deadline has passed.
            <br /> Further modifications to your work will be classified as <b>late</b>.
          </p>
        </Banner>
      )
    return (
      <Banner center>
        <p>
          You are more than {GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS} days past your deadline. <br />
          No further modifications to your work are possible.
        </p>
      </Banner>
    )
  }

  const GroupSection = () => {
    if (!group) {
      if (!exerciseIsOpen()) return <></>
      if (!groupIsLoaded) return <Banner center>Loading group data...</Banner>
      return <DefaultGroupArea onCreateGroup={createGroup} />
    }
    return (
      <GroupManagementArea
        group={group}
        enrolledStudents={enrolledStudents}
        membersActions={membersActions}
        disabled={!exerciseIsOpen()}
      />
    )
  }

  if (!spec && !fileRequirements?.length && !exercise.isGroupFormation) {
    return (
      <Banner center>
        <span>{'No details available for this exercise.'}</span>
      </Banner>
    )
  }

  const FooterMessage = () => {
    const GROUP_FORMATION_FOOTER =
      'This is a group formation exercise. No file nor code submission is expected.'
    const GROUP_SUBMISSION_FOOTER =
      "By accepting membership of this group, you agree that this is the group's collective work."
    const INDIVIDUAL_SUBMISSION_FOOTER =
      'By submitting, you agree that this is your own, unaided work.'

    return (
      <Footer>
        {exercise.isGroupFormation
          ? GROUP_FORMATION_FOOTER
          : exercise.isGroup
          ? GROUP_SUBMISSION_FOOTER
          : INDIVIDUAL_SUBMISSION_FOOTER}
      </Footer>
    )
  }

  return (
    <>
      <Deadline>Due {displayTimestamp(exercise.deadline)}</Deadline>

      {now() > exercise.deadline && <SubmissionUploadAvailabilityWarning />}
      {exercise.submissionType === 'group' && <GroupSection />}
      {(exercise.submissionType === 'individual' || group) && (
        <>
          {!!fileRequirements?.length && (
            <UploadWrapper>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap-reverse',
                  gap: '0.5rem 2rem',
                }}
              >
                {!userDetails?.isStaff && (
                  <Deadline css={{ color: '$green11' }}>
                    {submittedFiles.length} out of {fileRequirements.length} submitted
                    {submittedFiles.length === fileRequirements.length && (
                      <>, and you are all done! 🎉</>
                    )}
                  </Deadline>
                )}
              </div>
              <ProgressBar value={submittedFiles.length} max={fileRequirements.length} />
              {fileRequirements.map((fileRequirement, index) => (
                <FileUploadArea
                  key={index}
                  exercise={exercise}
                  disabled={!(exerciseIsOpen() && studentIsLeader())}
                  fileRequirement={fileRequirement}
                  submittedFiles={submittedFiles}
                  submitFile={submitFile(fileRequirements.length)}
                  deleteFile={deleteFile}
                />
              ))}
            </UploadWrapper>
          )}
          {(!!fileRequirements?.length || exercise.isGroupFormation) && <FooterMessage />}
        </>
      )}
    </>
  )
}

export default ExerciseStudent
