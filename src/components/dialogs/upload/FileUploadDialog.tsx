import { Accordion, Item } from '@radix-ui/react-accordion'
import memoize from 'fast-memoize'
import { useEffect, useMemo, useState } from 'react'
import { X } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'

import { Resource } from '../../../lib/materials.service'
import { useResources } from '../../../lib/resource.service'
import { useToast } from '../../../lib/toast.context'
import { now, toPlainSelectOption } from '../../../lib/utilities.service'
import {
  Caret,
  Content,
  DropzoneContainer,
  Header,
  Trigger,
} from '../../../styles/upload-dialog.style'
import { SelectOption } from '../../../types/global'
import { ResourceCreate } from '../../../types/materials'
import Dialog from '../Dialog'
import ResourceDetailsForm from './components/ResourceDetailsForm'

function borderRadiusForIndex(
  index: number,
  totalItems: number,
  isIndexOfSelectedItem: boolean
): string {
  let borderRadius = '0'
  if (totalItems === 1 && !isIndexOfSelectedItem) borderRadius = '0.5rem'
  else if (totalItems === 1 && isIndexOfSelectedItem) borderRadius = '0.5rem 0.5rem 0 0'
  else if (index === 0) borderRadius = '0.5rem 0.5rem 0 0'
  else if (index === totalItems - 1 && !isIndexOfSelectedItem) borderRadius = '0 0 0.5rem 0.5rem'
  return borderRadius
}

const FileUploadDialog = ({
  open,
  onOpenChange,
  existingCategories,
  existingTags,
  setRawMaterials,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  existingCategories: string[]
  existingTags: string[]
  setRawMaterials: (_: Resource[]) => void
}) => {
  const { addToast } = useToast()
  const { uploadResource } = useResources()
  const [fileResources, setFileResources] = useState<ResourceCreate[]>([])
  const [openItemIndex, setOpenItemIndex] = useState('0')
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])
  useEffect(() => {
    setCategoryOptions(existingCategories.map(toPlainSelectOption))
  }, [existingCategories])

  const [tagsOptions, setTagsOptions] = useState<SelectOption[]>([])
  useEffect(() => {
    setTagsOptions(existingTags.map(toPlainSelectOption))
  }, [existingTags])

  function onDrop(files: any) {
    setFileResources([
      ...fileResources,
      ...files.map((file: any) => {
        return {
          title: file.name,
          category: null,
          tags: [],
          visible_after: now(),
          file,
          type: 'file',
          path: '',
        }
      }),
    ])
  }

  const onResourceChange = useMemo(
    () =>
      memoize(
        (resourceIndex: number) => (key: string, value: any) =>
          setFileResources((resources: ResourceCreate[]) =>
            resources.map((res, index) =>
              index === resourceIndex ? { ...res, [key]: value } : res
            )
          )
      ),
    []
  )

  const setForAllResources = (key: string, value: any) => {
    setFileResources((resources: ResourceCreate[]) =>
      resources.map((res) => ({ ...res, [key]: value }))
    )
  }

  const isFormValid = (): boolean => {
    let isValid = true
    fileResources.forEach((res: ResourceCreate, index: number) => {
      if (res.category === '' || res.category === null) {
        addToast({ variant: 'error', title: `Missing category for ${res.file?.name}` })
        isValid = false
      } else if (openItemIndex !== index.toString() && res.title === '') {
        addToast({ variant: 'error', title: `Missing title for ${res.file?.name}` })
        isValid = false
      }
    })
    return isValid
  }

  return (
    <Dialog
      title="Upload resources"
      primaryButtonText={fileResources.length ? 'Upload' : ''}
      secondaryButtonText="Cancel"
      onPrimaryClick={() => {
        fileResources.map((res) => uploadResource(res, setRawMaterials))
        setFileResources([])
      }}
      isFormValid={isFormValid}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <DropzoneContainer {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag files here or click to select files</p>
          </DropzoneContainer>
        )}
      </Dropzone>
      <Accordion type="single" collapsible value={openItemIndex} onValueChange={setOpenItemIndex}>
        {fileResources &&
          fileResources.map((resource: ResourceCreate, index: number) => {
            const isIndexOfSelectedItem = index.toString() === openItemIndex
            const borderRadius = borderRadiusForIndex(
              index,
              fileResources.length,
              isIndexOfSelectedItem
            )

            return (
              <Item key={index} value={index.toString()}>
                <Header>
                  <Trigger
                    type="button"
                    style={{ borderRadius, display: 'float', justifyContent: 'space-between' }}
                  >
                    <div>
                      <Caret />
                      <span>{resource.title || resource.file?.name}</span>
                    </div>
                    <X
                      onClick={() =>
                        setFileResources((resources) => resources.filter((_, i) => i !== index))
                      }
                    />
                  </Trigger>
                </Header>
                <Content>
                  <ResourceDetailsForm
                    onResourceChange={onResourceChange(index)}
                    resource={resource}
                    categoryOptions={categoryOptions}
                    updateCategoryOptions={setCategoryOptions}
                    updateAttributeForAllResources={setForAllResources}
                    tagsOptions={tagsOptions}
                    updateTagOptions={setTagsOptions}
                  />
                </Content>
              </Item>
            )
          })}
      </Accordion>
    </Dialog>
  )
}

export default FileUploadDialog
