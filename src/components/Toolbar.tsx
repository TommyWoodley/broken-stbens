import React from 'react'

import { ToolbarContainer } from '../styles/toolbar.style'

export const Toolbar = ({ style = {}, children }: { style?: any; children: React.ReactNode }) => {
  return (
    <ToolbarContainer aria-label="" css={style} tabIndex={-1}>
      {children}
    </ToolbarContainer>
  )
}

// const FullToolbar = () => {
//     return (
//       <Toolbar aria-label="Formatting options">
//         <ToggleGroup type="multiple" aria-label="Text formatting">
//           <ToggleItem value="select" aria-label="select">
//             Select
//           </ToggleItem>
//         </ToggleGroup>
//         <Separator />
//         <Button css={{ marginLeft: 'auto' }}>Share</Button>
//       </Toolbar>
//     )
//   }
