import { format } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import Creatable from 'react-select/creatable'

import { getUTCDatetime } from '../../../../lib/resource.service'
import { ThemeContext } from '../../../../lib/theme.context'
import { useToast } from '../../../../lib/toast.context'
import { displayTimestamp, now, toPlainSelectOption } from '../../../../lib/utilities.service'
import { Footnote } from '../../../../styles/_app.style'
import {
  ApplyToAllButton,
  CalendarInput,
  DropdownStyle,
  Label,
  NowButton,
  TimeInput,
  TitleInput,
  Visibility,
} from '../../../../styles/resource-details-form.style'
import { SelectOption } from '../../../../types/global'
import { ResourceCreate } from '../../../../types/materials'

// maximum height of dropdown menu before scrolling
// https://react-select.com/props#creatable-props (see maxMenuHeight)
const MAX_OPTIONS_MENU_HEIGHT = 130

const ResourceDetailsForm = ({
  resource,
  onResourceChange,
  categoryOptions,
  tagsOptions,
  updateCategoryOptions,
  updateTagOptions,
  updateAttributeForAllResources,
}: {
  resource: ResourceCreate
  onResourceChange: (key: string, value: any) => void
  categoryOptions: SelectOption[]
  tagsOptions: SelectOption[]
  updateCategoryOptions?: any
  updateTagOptions?: any
  updateAttributeForAllResources?: (key: string, value: any) => void
}) => {
  const { addToast } = useToast()
  const { theme } = useContext(ThemeContext)
  const [title, setTitle] = useState(resource.title)
  const [category, setCategory] = useState<string | null>(resource.category)
  const [tags, setTags] = useState<string[]>(resource.tags)
  const [path, setPath] = useState(resource.path)
  const [visibleDate, setVisibleDate] = useState(format(resource.visible_after, 'yyyy-MM-dd'))
  const [visibleTime, setVisibleTime] = useState(format(resource.visible_after, 'HH:mm'))

  useEffect(() => onResourceChange('title', title), [onResourceChange, title])
  useEffect(() => onResourceChange('category', category), [category, onResourceChange])
  useEffect(() => onResourceChange('tags', tags), [onResourceChange, tags])
  useEffect(() => onResourceChange('path', path), [onResourceChange, path])
  useEffect(() => {
    visibleDate &&
      visibleTime &&
      onResourceChange('visible_after', getUTCDatetime(visibleDate, visibleTime))
  }, [addToast, onResourceChange, visibleDate, visibleTime])

  if (resource === null) return null
  return (
    <>
      {resource.type === 'link' && (
        <div style={{ marginTop: '0.5rem' }}>
          <Label htmlFor="resourceLink" css={{ lineHeight: '2rem', marginRight: '1rem' }}>
            URL
          </Label>

          <TitleInput
            type="url"
            value={path}
            name="resourceLink"
            placeholder="https://www.example.com"
            onChange={({ target: { value } }) => setPath(value)}
            required
          />
        </div>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <Label htmlFor="resourceTitle" css={{ lineHeight: '2rem', marginRight: '1rem' }}>
          Title of resource
        </Label>

        <TitleInput
          type="text"
          value={title}
          name="resourceTitle"
          placeholder="Title"
          onChange={({ target: { value } }) => setTitle(value)}
          required
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Label
          htmlFor="editCategory"
          css={{
            marginRight: '1rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Section Header
        </Label>
        {updateAttributeForAllResources && (
          <ApplyToAllButton
            type="button"
            onClick={() => {
              if (!category) return
              updateAttributeForAllResources('category', category)
              addToast({
                variant: 'info',
                title: `Section header '${category}' applied to all uploaded files`,
              })
            }}
          >
            Apply category to all
          </ApplyToAllButton>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          <Creatable
            styles={DropdownStyle}
            isClearable
            placeholder={'Select or create a new section header'}
            value={category ? toPlainSelectOption(category) : null}
            onChange={(newValue) => setCategory(newValue?.value || null)}
            options={categoryOptions}
            onCreateOption={(newCategory) => {
              setCategory(newCategory)
              if (newCategory !== null && updateCategoryOptions)
                updateCategoryOptions((categoryOptions: any) => [
                  ...categoryOptions,
                  toPlainSelectOption(newCategory),
                ])
            }}
            classNamePrefix={'edit-select'}
            maxMenuHeight={MAX_OPTIONS_MENU_HEIGHT}
          />
        </div>

        <Footnote muted css={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0.5rem' }}>
          You can create a new section header by typing the desired name and hitting enter. Headers
          are ordered alphabetically.
        </Footnote>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Label
          htmlFor="editTags"
          css={{
            marginRight: '1rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Tags
        </Label>
        {updateAttributeForAllResources && (
          <ApplyToAllButton
            type="button"
            onClick={() => {
              if (!tags) return
              updateAttributeForAllResources('tags', tags)
              addToast({
                variant: 'info',
                title: `Tags [${tags.join(', ')}] applied to all uploaded files`,
              })
            }}
          >
            Apply tags to all
          </ApplyToAllButton>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          <Creatable
            styles={DropdownStyle}
            isClearable
            isMulti
            placeholder={'Select or create new tags'}
            value={tags.map(toPlainSelectOption)}
            onChange={(newValues) => setTags(newValues.map((v) => v.value))}
            options={tagsOptions}
            onCreateOption={(newTag) => {
              setTags((tags) => [...tags, newTag])
              if (newTag !== null && updateTagOptions)
                updateTagOptions((tagOptions: any) => [...tagOptions, toPlainSelectOption(newTag)])
            }}
            classNamePrefix={'edit-select'}
            maxMenuHeight={MAX_OPTIONS_MENU_HEIGHT}
          />
        </div>
        <Footnote muted css={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0.5rem' }}>
          You can create a new tag by typing it and hitting enter.
        </Footnote>
      </div>

      <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <Label
          htmlFor="editVisibleAfter"
          css={{ lineHeight: '2rem', marginRight: '1rem', marginTop: '15rem' }}
        >
          Publish date:
        </Label>
        {updateAttributeForAllResources && (
          <ApplyToAllButton
            type="button"
            onClick={() => {
              if (!visibleDate || !visibleTime) return
              const visibleAfter = getUTCDatetime(visibleDate, visibleTime)
              updateAttributeForAllResources('visible_after', visibleAfter)
              addToast({
                variant: 'info',
                title: `All uploaded files set to publish at ${displayTimestamp(
                  visibleAfter,
                  'HH:mm, d LLL yy'
                )}`,
              })
            }}
          >
            Apply date to all
          </ApplyToAllButton>
        )}

        <div style={{ display: 'flex', colorScheme: theme }}>
          <CalendarInput
            type="date"
            style={{ marginRight: '1rem' }}
            value={visibleDate}
            onChange={(event) => setVisibleDate(event.target.value)}
            required
          />
          <TimeInput
            type="time"
            value={visibleTime}
            onChange={(event) => setVisibleTime(event.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: '0.8rem' }}>
          <NowButton
            type="button"
            onClick={() => {
              setVisibleDate(format(now(), 'yyyy-MM-dd'))
              setVisibleTime(format(now(), 'HH:mm'))
            }}
          >
            Publish now
          </NowButton>
          <Visibility
            style={{
              visibility:
                getUTCDatetime(visibleDate, visibleTime) <= new Date() ? 'visible' : 'hidden',
            }}
          >
            <InfoCircle style={{ marginRight: '0.25rem' }} />
            This resource will be visible to students
          </Visibility>
        </div>
      </div>
    </>
  )
}

export default ResourceDetailsForm
