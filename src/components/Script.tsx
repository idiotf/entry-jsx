import React, { useContext } from 'react'
import type { ScriptData } from '@/types'
import { useEntryId, useParam } from '@/hooks'
import { ParamsContext, ScriptContext } from '@/contexts'

export interface ScriptProps extends React.PropsWithChildren<Partial<Omit<ScriptData, 'type'>>> {
  type: string
}

/**
 * `<Statement>` 컴포넌트 내부에 스크립트를 정의합니다. 이 컴포넌트는 `<Statement>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='when_run_button_click' />
 *           <Script type='show' />
 *         </Statement>
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Script({
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
}: ScriptProps) {
  const params = useContext(ParamsContext)
  if (!params) throw TypeError('<Script> 컴포넌트는 <Script> 또는 <Statement> 내부에서 사용해야 합니다.')

  const id = useEntryId()

  const script: ScriptData = {
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

  useParam(params, { value: script })

  return (
    <ScriptContext.Provider value={script.statements}>
      <ParamsContext.Provider value={script.params}>
        {children}
      </ParamsContext.Provider>
    </ScriptContext.Provider>
  )
}

/**
 * `<EntryObject>` 또는 `<Script>` 컴포넌트 내부에서 단일 스크립트 statement를 정의합니다.
 * 이 컴포넌트는 `<Script>` 또는 `<EntryObject>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='_if'>
 *             <Statement>
 *               <Script type='show' />
 *             </Statement>
 *           </Script>
 *         </Statement>
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Statement({ children }: React.PropsWithChildren) {
  const script = useContext(ScriptContext)
  if (!script) throw TypeError('<Statement> 컴포넌트는 <Script> 또는 <EntryObject> 내부에서 사용해야 합니다.')

  const statement: ScriptData[] = []

  useParam(script, { value: statement })

  return (
    <ParamsContext.Provider value={statement}>
      {children}
    </ParamsContext.Provider>
  )
}
