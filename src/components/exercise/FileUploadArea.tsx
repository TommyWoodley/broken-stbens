import prettyBytes from 'pretty-bytes'
import { ReactNode } from 'react'
import { Check2, Git, Trash3Fill, Upload } from 'react-bootstrap-icons'
import { format as formatTimeAgo } from 'timeago.js'

import { GITLAB_HASH } from '../../constants/global'
import { DeleteButton } from '../../styles/deleteButton.style'
import { UploadTrigger } from '../../styles/exercise/exercise.style'
import { css } from '../../styles/stitches.config'
import { Exercise, FileRequirement } from '../../types/schemas/abc'
import { ExerciseSubmission } from '../../types/schemas/emarking'

const FileUploadArea = ({
  exercise,
  disabled = false,
  fileRequirement,
  submittedFiles,
  submitFile,
  deleteFile,
}: {
  exercise: Exercise
  disabled?: boolean
  fileRequirement: FileRequirement
  submittedFiles: ExerciseSubmission[]
  submitFile: (file: File, targetFileName: string) => void
  deleteFile: (_: ExerciseSubmission) => void
}) => {
  const lastSeparator = fileRequirement.name.lastIndexOf('.')
  const fileName = fileRequirement.name.slice(0, lastSeparator)
  const fileType = fileRequirement.name.slice(lastSeparator + 1)
  const submittedFile =
    submittedFiles.find((file) => file.targetFileName === fileRequirement.name) ?? null
  const isLabTSHandIn = fileType === GITLAB_HASH

  function onClick(event: any) {
    if (isLabTSHandIn) {
      window.open('https://teaching.doc.ic.ac.uk/labts', '_blank')
      return
    }
    if (!submittedFile) return
    if (
      event.target.classList.contains('delete-button') ||
      (['svg', 'path'].includes(event.target.nodeName) &&
        event.target.parentElement.classList.contains('delete-button'))
    ) {
      event.preventDefault()
      return
    }
    window.open(submittedFile.url, '_blank')
  }

  const AnchorWrapper = ({ children }: { children: ReactNode }) => {
    return submittedFile || isLabTSHandIn ? (
      <a
        href={isLabTSHandIn ? 'https://teaching.doc.ic.ac.uk/labts' : submittedFile!.url}
        title={isLabTSHandIn ? 'Submit GitLab hash via LabTS' : submittedFile!.targetFileName}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        style={{
          margin: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {children}
      </a>
    ) : (
      <>{children}</>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: 'auto' }}>
      <AnchorWrapper>
        <UploadTrigger
          htmlFor={`exercise-upload-${fileName + fileType}`}
          submitted={!!submittedFile}
          onClick={(event) => {
            if (!submittedFile) return
          }}
          disabled={!submittedFile && disabled}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {submittedFile ? (
              <Check2 className={css({ fill: '$green9', minWidth: '1.5rem' })()} size={24} />
            ) : isLabTSHandIn ? (
              <Git size={24} />
            ) : (
              <Upload size={24} />
            )}
            <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
              <p>
                {isLabTSHandIn
                  ? 'GitLab Hash (via LabTS)'
                  : fileName[0].toUpperCase() + fileName.substring(1).replace(/[-_]/g, ' ')}
              </p>
              <p className={css({ fontSize: '$md', color: '$sand9', marginTop: '0.125rem' })()}>
                {submittedFile?.gitlabHash || fileType}
              </p>
            </div>
          </div>

          {submittedFile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'right',
                  marginRight: '1rem',
                  marginLeft: '3rem',
                  alignItems: 'end',
                  width: 'fit-content',
                }}
              >
                <i
                  className={css({ fontSize: '$sm', color: '$sand10', marginBottom: '0.125rem' })()}
                >
                  Submitted {submittedFile.timestamp > exercise.deadline && 'late'}{' '}
                  {formatTimeAgo(submittedFile.timestamp)}
                </i>
                <p className={css({ fontSize: '$sm', color: '$sand9' })()}>
                  {!isLabTSHandIn && prettyBytes(submittedFile.fileSize)}
                </p>
              </div>
              {!disabled && !isLabTSHandIn && (
                <DeleteButton
                  type="button"
                  aria-label="delete"
                  className="delete-button"
                  title={`Delete submission for ${submittedFile.targetFileName}`}
                  onClick={(event) => {
                    deleteFile(submittedFile)
                  }}
                >
                  <Trash3Fill className="delete-button" size={20} />
                </DeleteButton>
              )}
            </div>
          )}
        </UploadTrigger>
      </AnchorWrapper>

      <input
        hidden
        type="file"
        disabled={disabled || !!submittedFile || isLabTSHandIn}
        id={`exercise-upload-${fileName + fileType}`}
        accept={fileType ? '.' + fileType : ''}
        onChange={(event) => {
          if (disabled || !event.target.files?.length) return
          submitFile(event.target.files[0], fileRequirement.name)
          // Fixes Chrome and Firefox upload issue.
          // https://stackoverflow.com/a/25948969/10564311
          event.target.value = ''
          return false
        }}
      />
    </div>
  )
}
export default FileUploadArea
