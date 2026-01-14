import React, { useContext } from 'react'
import type { BlockData } from '../types'
import { useEntryId, useParam } from '../internal/hooks'
import { ParamsContext, ScriptContext } from '../internal/contexts'

export interface BlockProps extends React.PropsWithChildren<Partial<Omit<BlockData, 'type'>>> {
  type: string
}

/**
 * `<Statement>` 컴포넌트 내부에 블록을 정의합니다. 이 컴포넌트는 `<Statement>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <SpriteObject name='엔트리봇'>
 *         <Statement>
 *           <Block type='when_run_button_click' />
 *           <Block type='show' />
 *         </Statement>
 *       </SpriteObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Block({
  id,
  type,
  x = 0,
  y = 0,
  assemble = true,
  copyable = true,
  deletable = 1,
  emphasized = false,
  movable = null,
  readOnly = null,
  extensions = [],
  children,
}: BlockProps) {
  const params = useContext(ParamsContext)
  if (!params) throw TypeError('<Block> 컴포넌트는 <Block> 또는 <Statement> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ??= defaultId

  const block: BlockData = {
    id,
    type,
    params: [],
    statements: [],
    x,
    y,
    assemble,
    copyable,
    deletable,
    emphasized,
    movable,
    readOnly,
    extensions,
  }

  useParam(params, { value: block })

  return (
    <ScriptContext.Provider value={block.statements}>
      <ParamsContext.Provider value={block.params}>
        {children}
      </ParamsContext.Provider>
    </ScriptContext.Provider>
  )
}

/**
 * @deprecated 이 컴포넌트는 `<Block>`으로 이름이 변경되었습니다. 대신 `<Block>` 컴포넌트를 사용해 주세요.
 */
export const Script = Block

/**
 * `<SpriteObject>`, `<TextBoxObject>` 또는 `<Block>` 컴포넌트 내부에서 단일 스크립트 statement를 정의합니다.
 * 이 컴포넌트는 `<SpriteObject>`, `<TextBoxObject>` 또는 `<Block>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <SpriteObject name='엔트리봇'>
 *         <Statement>
 *           <Block type='_if'>
 *             <Statement>
 *               <Block type='show' />
 *             </Statement>
 *           </Block>
 *         </Statement>
 *       </SpriteObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Statement({ children }: React.PropsWithChildren) {
  const block = useContext(ScriptContext)
  if (!block) throw TypeError('<Statement> 컴포넌트는 <SpriteObject>, <TextBoxObject> 또는 <Block> 내부에서 사용해야 합니다.')

  const statement: BlockData[] = []

  useParam(block, { value: statement })

  return (
    <ParamsContext.Provider value={statement}>
      {children}
    </ParamsContext.Provider>
  )
}
