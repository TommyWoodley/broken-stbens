import { utcToZonedTime } from 'date-fns-tz'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  Check,
  Check2Circle,
  Dash,
  Download,
  FileEarmarkCodeFill,
  FileEarmarkFill,
  FileEarmarkImageFill,
  FileEarmarkPdfFill,
  Link,
  PencilSquare,
  PlayFill,
  Trash3Fill,
  Upload,
} from 'react-bootstrap-icons'
import { Helmet } from 'react-helmet-async'
import { useOutletContext, useParams } from 'react-router-dom'

import { CollapsibleList } from '../components/CollapsibleList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import DeleteDialog from '../components/dialogs/DeleteDialog'
import EditDialog from '../components/dialogs/EditDialog'
import FileUploadDialog from '../components/dialogs/upload/FileUploadDialog'
import LinkUploadDialog from '../components/dialogs/upload/LinkUploadDialog'
import { LevelToggles } from '../components/game/LevelToggles'
import { endpoints } from '../constants/endpoints'
import { LONDON_TIMEZONE } from '../constants/global'
import titles from '../constants/titles'
import useChecklist from '../lib/checkbox.service'
import { useReordering } from '../lib/dragDrop.service'
import { useGame } from '../lib/game/game.context'
import { LevelsManager } from '../lib/game/levels.service'
import { useMaterials } from '../lib/materials.service'
import { useUser } from '../lib/user.context'
import { encodeURL, getFileExtension } from '../lib/utilities.service'
import { Banner, Button, Checkbox, Footnote, Indicator, Wrapper } from '../styles/_app.style'
import { Caret } from '../styles/collapsible-list.style'
import { ToggleDragDropButton } from '../styles/dragDrop.style'
import { Tag, Tags } from '../styles/materials.style'
import { Toggle } from '../styles/toolbar.style'
import { UserDetails } from '../types/schemas/abc'

const Materials = () => {
  const [checklistMode, setSelectionMode] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [linkUploadDialogOpen, setLinkUploadDialogOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState(null)
  const [dragEnabled, setDragEnabled] = useState(false)

  const { userDetails } = useUser()
  const { gameSettingOn } = useGame()
  const { moduleCode, levelsManager } = useOutletContext<{
    moduleCode: string | null
    levelsManager: LevelsManager
  }>()
  const moduleTitle = userDetails?.modules.find((m) => m.code === moduleCode)?.title
  const { year } = useParams()
  const {
    groupedMaterials,
    setRawMaterials,
    isLoaded,
    noMaterials,
    addCompleteResources,
    isComplete,
  } = useMaterials(levelsManager)
  const checklistManager = useChecklist(groupedMaterials, 'id', false)
  const { onDragEnd } = useReordering(setRawMaterials)
  const existingCategories = Object.keys(groupedMaterials)
  const existingTags = Object.values(groupedMaterials)
    .flat()
    .flatMap((m) => m.tags)
    .filter((tag, pos, ar) => ar.indexOf(tag) === pos)

  const onComplete = () => {
    addCompleteResources(
      checklistManager
        .getCheckedItems()
        .map((resourceId) => parseInt(resourceId))
        .filter((resourceId) => !isComplete(resourceId))
    )
  }

  /* Toolbar button callbacks */
  const onDownload = () => {
    const idsToDownload = checklistManager.getCheckedItems()
    const queryParameter = idsToDownload.map((id) => `id=${id}`).join('&')
    window.open(
      `${endpoints.resourcesArchive}?year=${year!}&course=${moduleCode}&${queryParameter}`
    )
  }

  function resourceIcon(resource: any) {
    function isPanopto(): boolean {
      return ['imperial.cloud.panopto.eu/', 'Viewer.aspx?id='].every((s) =>
        resource.path.includes(s)
      )
    }

    const CODE_EXTS = ['java', 'c', 'cpp', 'h', 'hs', 'py', 'sh', 'kt', 'sql']
    const IMG_EXTS = ['jpeg', 'jpg', 'png', 'svg']
    const iconProps = { color: 'grey', size: 26 }
    if (resource.type === 'link') {
      return isPanopto() ? <PlayFill {...iconProps} /> : <Link {...iconProps} />
    }
    if (resource.path.endsWith('.pdf')) return <FileEarmarkPdfFill {...iconProps} />
    if (CODE_EXTS.some((ext) => resource.path.endsWith(ext)))
      return <FileEarmarkCodeFill {...iconProps} />
    if (IMG_EXTS.some((ext) => resource.path.endsWith(ext)))
      return <FileEarmarkImageFill {...iconProps} />
    return <FileEarmarkFill {...iconProps} />
  }

  function isStaffView(moduleCode: string | null, userDetails: UserDetails | undefined): boolean {
    if (!(moduleCode && userDetails)) return false
    return userDetails.isStaff || userDetails.isTaForModule(moduleCode)
  }

  const headerGenerator = (collection: string, _: object[]) => (
    <>
      <Caret />
      <span>{collection}</span>
    </>
  )

  const contentGenerator = (_: string, items: { [_: string]: any }[]) => (
    <Tabs
      data={items}
      generator={(resource: any) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '2.5rem',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          {resourceIcon(resource)}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Wrapper inline>
              <span>{resource.title}</span>
              {gameSettingOn && isComplete(resource.id) && <Check2Circle size={19} />}
            </Wrapper>
            <Tags>
              {resource.tags.map((tag: string) => (
                <Tag key={`${resource.id}${tag}`}>#{tag}</Tag>
              ))}
            </Tags>
          </div>
        </div>
      )}
      href={(resource) => {
        const fileName = getFileExtension(resource.title)
          ? resource.title
          : `${resource.title}${getFileExtension(resource.path)}`
        return `/external-resource?url=${encodeURL(
          resource.type === 'link'
            ? resource.path
            : endpoints.resourceFileToGet(resource.id, fileName)
        )}`
      }}
      target="_blank"
      dragDropOptions={{
        dragEnabled,
        droppableId: items[0]?.category ?? 'empty',
      }}
    />
  )

  const initialToolbar = (
    <Toolbar style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {isStaffView(moduleCode, userDetails) && (
          <>
            <Button icon onClick={() => setUploadDialogOpen(true)} title="Upload a file resources">
              <Upload size={22} />
            </Button>
            <Button
              icon
              onClick={() => setLinkUploadDialogOpen(true)}
              title="Upload a link resource"
            >
              <Link size={22} />
            </Button>
          </>
        )}
      </div>
    </Toolbar>
  )

  const toolbar = (
    <Toolbar style={{ marginBottom: '1rem' }}>
      <Toggle defaultPressed={checklistMode} onClick={(event) => setSelectionMode(!checklistMode)}>
        Actions
      </Toggle>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '0.2rem' }}>
        {!checklistMode && isStaffView(moduleCode, userDetails) && (
          <>
            <Button icon onClick={() => setUploadDialogOpen(true)} title="Upload a file resources">
              <Upload size={22} />
            </Button>

            <Button
              icon
              onClick={() => setLinkUploadDialogOpen(true)}
              title="Upload a link resource"
            >
              <Link size={22} />
            </Button>
            <ToggleDragDropButton
              dragEnabled={dragEnabled}
              onClick={() => setDragEnabled((prev) => !prev)}
              title={`${dragEnabled ? 'Disable' : 'Enable'} resource reordering`}
            >
              Reorder
            </ToggleDragDropButton>
          </>
        )}
        {checklistMode && (
          <>
            {isStaffView(moduleCode, userDetails) && (
              <Button
                icon
                css={{ marginRight: '0.75rem' }}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={checklistManager.getCheckedItems().length === 0}
              >
                <Trash3Fill size={22} />
              </Button>
            )}
            {gameSettingOn && (
              <Button
                icon
                css={{ marginRight: '0.75rem' }}
                onClick={onComplete}
                disabled={checklistManager
                  .getCheckedItems()
                  .every((resourceId) => isComplete(parseInt(resourceId)))}
              >
                <Check2Circle size={22} />
              </Button>
            )}
            <Button
              icon
              css={{ marginRight: '0.75rem' }}
              onClick={onDownload}
              disabled={checklistManager.getCheckedItems().length === 0}
            >
              <Download size={22} />
            </Button>
            <Checkbox
              css={{ marginTop: '0.5rem' }}
              checked={checklistManager.getCheckedState()}
              onCheckedChange={checklistManager.onToggle}
            >
              <Indicator>
                {checklistManager.getCheckedState() === 'indeterminate' ? <Dash /> : <Check />}
              </Indicator>
            </Checkbox>
          </>
        )}
      </div>
    </Toolbar>
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Helmet>
        <title>{titles.module(year, moduleCode, moduleTitle)}</title>
      </Helmet>
      <Wrapper>
        {noMaterials() ? (
          <>
            {initialToolbar}
            <Banner center>
              <span>{!isLoaded() ? 'Loading materials...' : 'No materials for this module.'}</span>
            </Banner>
          </>
        ) : (
          <>
            {gameSettingOn && levelsManager.hasMinLevels && <LevelToggles {...levelsManager} />}
            {isStaffView(moduleCode, userDetails) && (
              <p style={{ margin: '1rem 1rem 2rem 1rem', textAlign: 'center' }}>
                <b>
                  The materials you upload here will be visible to all students. Please refrain from
                  uploading model answers and solutions to courseworks here.
                </b>
              </p>
            )}
            {toolbar}
            <CollapsibleList
              data={groupedMaterials}
              checklistMode={checklistMode}
              checklistManager={checklistManager}
              headerGenerator={headerGenerator}
              contentGenerator={contentGenerator}
              mainItemAction={
                (isStaffView(moduleCode, userDetails) && {
                  icon: <PencilSquare size={22} />,
                  action: (item: any) => {
                    setResourceToEdit({
                      ...item,
                      visible_after: utcToZonedTime(item.visible_after, LONDON_TIMEZONE),
                    })
                    setEditDialogOpen(true)
                  },
                }) ||
                undefined
              }
            />
            <Footnote muted center css={{ margin: '2rem 0' }}>
              Please contact the relevant module leader(s) for missing resources or if you'd like
              materials to be better organised. We recommend communicating via the EdStem forum.
            </Footnote>
          </>
        )}
      </Wrapper>
      {deleteDialogOpen && (
        <DeleteDialog
          onOpenChange={setDeleteDialogOpen}
          selectedIDs={checklistManager.getCheckedItems()}
          moduleCode={moduleCode}
          groupedMaterials={groupedMaterials}
          setRawMaterials={setRawMaterials}
        />
      )}
      {editDialogOpen && resourceToEdit !== null && (
        <EditDialog
          onOpenChange={setEditDialogOpen}
          existingCategories={existingCategories}
          existingTags={existingTags}
          setResourceToEdit={setResourceToEdit}
          resourceToEdit={resourceToEdit}
          moduleCode={moduleCode}
          setRawMaterials={setRawMaterials}
        />
      )}

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        existingCategories={existingCategories}
        existingTags={existingTags}
        setRawMaterials={setRawMaterials}
      />

      <LinkUploadDialog
        open={linkUploadDialogOpen}
        onOpenChange={setLinkUploadDialogOpen}
        existingCategories={existingCategories}
        existingTags={existingTags}
        setRawMaterials={setRawMaterials}
      />
    </DragDropContext>
  )
}

export default Materials
