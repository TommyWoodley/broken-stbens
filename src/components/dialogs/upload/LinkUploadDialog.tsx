import { useCallback, useState } from 'react'

import { Resource } from '../../../lib/materials.service'
import { useResources } from '../../../lib/resource.service'
import { useToast } from '../../../lib/toast.context'
import { now, toPlainSelectOption } from '../../../lib/utilities.service'
import { ResourceCreate } from '../../../types/materials'
import Dialog from '../Dialog'
import ResourceDetailsForm from './components/ResourceDetailsForm'

const defaultLinkResource: ResourceCreate = {
  title: '',
  category: null,
  tags: [],
  visible_after: now(),
  type: 'link',
  path: '',
}

const LinkUploadDialog = ({
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
  const { uploadResource } = useResources()
  const { addToast } = useToast()
  const [linkResource, setLinkResource] = useState<ResourceCreate>(defaultLinkResource)

  const onResourceChange = useCallback(
    (key: string, value: string) =>
      setLinkResource((linkResource: ResourceCreate) => ({ ...linkResource, [key]: value })),
    []
  )

  const isFormValid = (): boolean => {
    if (linkResource.category === null) {
      addToast({ variant: 'error', title: 'Missing category' })
      return false
    }
    return true
  }

  return (
    <Dialog
      title={'Upload Link'}
      primaryButtonText={'Upload'}
      secondaryButtonText={'Cancel'}
      onPrimaryClick={() => {
        uploadResource(linkResource, setRawMaterials)
        setLinkResource(defaultLinkResource)
      }}
      isFormValid={isFormValid}
      open={open}
      onOpenChange={onOpenChange}
    >
      <ResourceDetailsForm
        onResourceChange={onResourceChange}
        resource={linkResource}
        categoryOptions={existingCategories.map(toPlainSelectOption)}
        tagsOptions={existingTags.map(toPlainSelectOption)}
      />
    </Dialog>
  )
}

export default LinkUploadDialog
