import { Check, ChevronDown, ChevronUp } from 'react-bootstrap-icons'

import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '../styles/select.style'

export const SelectBox = ({
  title,
  items,
  display = (s) => s,
  defaultValue,
  placeholder,
  onSelect,
  value,
}: {
  title: string
  items: string[]
  display?: (_: string) => string
  defaultValue: string
  placeholder?: string
  onSelect: (_: any) => void
  value: string
}) => (
  <Select value={value} onValueChange={onSelect} defaultValue={defaultValue}>
    <SelectTrigger aria-label={title}>
      <SelectValue placeholder={placeholder} />
      <SelectIcon>
        <ChevronDown />
      </SelectIcon>
    </SelectTrigger>
    <SelectContent>
      <SelectScrollUpButton>
        <ChevronUp />
      </SelectScrollUpButton>
      <SelectViewport>
        {items.map((item: string, index: number) => (
          <SelectItem key={index} value={`${index}`}>
            <SelectItemText>{display(item)}</SelectItemText>
            <SelectItemIndicator>
              <Check />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectViewport>
      <SelectScrollDownButton>
        <ChevronDown />
      </SelectScrollDownButton>
    </SelectContent>
  </Select>
)
