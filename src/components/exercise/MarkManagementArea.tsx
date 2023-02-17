import React from 'react'
import Dropzone from 'react-dropzone'

import { Button, Footnote } from '../../styles/_app.style'
import {
  DropzoneContainer,
  InnerContainer,
  MainContainer,
} from '../../styles/exercise/markManagementArea.style'
import { RawMarks } from '../../types/global'

export const MarkManagementArea = ({
  marksToSave,
  onMarkFileUpload,
  onMarksSave,
}: {
  marksToSave: RawMarks
  onMarkFileUpload: (file: File) => void
  onMarksSave: (marks: RawMarks) => void
}) => {
  return (
    <MainContainer>
      <InnerContainer>
        <Dropzone
          accept={{ 'text/csv': ['.csv'] }}
          multiple={false}
          onDrop={([file]) => onMarkFileUpload(file)}
        >
          {({ getRootProps, getInputProps }) => (
            <DropzoneContainer {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag or click to upload your marking CSV</p>
            </DropzoneContainer>
          )}
        </Dropzone>
        <Button
          disabled={!Object.keys(marksToSave).length}
          onClick={() => onMarksSave(marksToSave)}
          title="Save Marks"
          warning={!!Object.keys(marksToSave).length}
        >
          {!!Object.keys(marksToSave).length ? 'Save Marks' : 'Up-to-date'}
        </Button>
      </InnerContainer>
      <Footnote muted style={{ textAlign: 'center' }}>
        You can upload marks by entering them one by one in the table or uploading a CSV containing
        a login-to-mark mapping. Marks are auto-capped at the exercise maximum mark, and negative
        values are replaced with 0.
      </Footnote>
    </MainContainer>
  )
}
