import { useCallback, useContext, useState } from 'react'
import { Trash3Fill } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'
import { useParams } from 'react-router-dom'

import { endpoints } from '../../constants/endpoints'
import { AxiosContext } from '../../lib/axios.context'
import { Resource } from '../../lib/materials.service'
import { useToast } from '../../lib/toast.context'
import { toPlainSelectOption } from '../../lib/utilities.service'
import { Button, Hr, StandardDiv } from '../../styles/_app.style'
import { DropzoneContainer } from '../../styles/upload-dialog.style'
import { ResourceCreate } from '../../types/materials'
import Dialog from './Dialog'
import ResourceDetailsForm from './upload/components/ResourceDetailsForm'

const EditDialog = ({
  resourceToEdit,
  setResourceToEdit,
  onOpenChange,
  existingCategories,
  existingTags,
  moduleCode,
  setRawMaterials,
}: {
  resourceToEdit: any
  setResourceToEdit: (_: any) => void
  onOpenChange: (_: boolean) => void
  existingCategories: string[]
  existingTags: string[]
  moduleCode: string | null
  setRawMaterials: (_: Resource[]) => void
}) => {
  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()
  const [newResourceFile, setNewResourceFile] = useState<File>()

  resourceToEdit.tags = resourceToEdit.tags.filter((tag: string) => tag !== 'new')

  const onSubmit = async () => {
    if (newResourceFile) {
      let formData = new FormData()
      formData.append('file', newResourceFile)

      await axiosInstance
        .request({
          method: 'PUT',
          url: endpoints.resourceFileToUpdate(resourceToEdit.id),
          data: formData,
        })
        .catch((error: any) => {
          addToast({
            variant: 'error',
            title: `Error uploading file '${newResourceFile.name}.`,
          })
          console.error(error)
        })
    }

    let resourceData = { ...resourceToEdit }

    if ('link' != resourceToEdit.type) delete resourceData['path']

    await axiosInstance
      .request({
        method: 'PUT',
        url: endpoints.resource(resourceToEdit.id),
        data: resourceData,
      })
      .then(() => {
        addToast({ variant: 'success', title: 'Resource successfully edited' })
        axiosInstance
          .request({
            method: 'GET',
            url: endpoints.resources,
            params: { year, course: moduleCode },
          })
          .then(({ data }: any) => setRawMaterials(data))
          .catch((error: any) => {
            addToast({ variant: 'error', title: 'There was an error fetching resources' })
            console.error(error)
          })
      })
      .catch((error: any) => {
        addToast({ variant: 'error', title: 'There was an error editing this resource' })
        console.error(error)
      })
  }

  const isFormValid = (): boolean => {
    if (resourceToEdit.category === null) {
      addToast({ variant: 'error', title: 'Missing category' })
      return false
    }
    return true
  }

  const onResourceChange = useCallback(
    (key: string, value: string) => {
      setResourceToEdit((resource: ResourceCreate) => ({ ...resource, [key]: value }))
    },
    [setResourceToEdit]
  )

  const UploadedFileRow = () => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            justifyContent: 'space-between',
            marginTop: '2rem',
          }}
        >
          <StandardDiv>{newResourceFile!.name}</StandardDiv>
          <Button icon onClick={() => setNewResourceFile(undefined)} title="Delete uploaded file">
            <Trash3Fill size={22} />
          </Button>
        </div>
        <Hr style={{ margin: '1rem' }} />
      </>
    )
  }

  if (resourceToEdit === null) return null
  return (
    <Dialog
      title={`Edit "${resourceToEdit.title}"`}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      onPrimaryClick={onSubmit}
      open={true}
      onOpenChange={onOpenChange}
      isFormValid={isFormValid}
    >
      {resourceToEdit.type === 'file' && (
        <Dropzone multiple={false} onDrop={([file]) => setNewResourceFile(file)}>
          {({ getRootProps, getInputProps }) => (
            <DropzoneContainer {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag a new file here or click to select one</p>
            </DropzoneContainer>
          )}
        </Dropzone>
      )}
      {resourceToEdit.type === 'file' && newResourceFile && <UploadedFileRow />}
      <ResourceDetailsForm
        resource={resourceToEdit}
        onResourceChange={onResourceChange}
        categoryOptions={existingCategories.map(toPlainSelectOption)}
        tagsOptions={existingTags.map(toPlainSelectOption)}
      />
    </Dialog>
  )
}

export default EditDialog
