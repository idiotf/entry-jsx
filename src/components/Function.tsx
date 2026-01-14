import React, { useContext } from 'react'
import { useEntryId, useParam } from '../internal/hooks'
import { FunctionContext, ProjectContext, ScriptContext } from '../internal/contexts'
import type { BlockData, FunctionData } from '../types'

export function NormalFunc({ id, children }: React.PropsWithChildren<{
  id: string
}>) {
  const project = useContext(ProjectContext)
  if (!project) throw TypeError('<NormalFunc> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const script: BlockData[][] = []
  const func: FunctionData = {
    id,
    get content() {
      return JSON.stringify(script)
    },
    type: 'normal',
    useLocalVariables: false,
  }

  useParam(project.functions, { value: func })

  return (
    <FunctionContext.Provider value={func}>
      <ScriptContext.Provider value={script}>
        {children}
      </ScriptContext.Provider>
    </FunctionContext.Provider>
  )
}

export function ValueFunc({ id, children }: React.PropsWithChildren<{
  id: string
}>) {
  const project = useContext(ProjectContext)
  if (!project) throw TypeError('<ValueFunc> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ??= defaultId

  const script: BlockData[][] = []
  const func: FunctionData = {
    id,
    get content() {
      return JSON.stringify(script)
    },
    type: 'value',
    useLocalVariables: false,
  }

  useParam(project.functions, { value: func })

  return (
    <FunctionContext.Provider value={func}>
      <ScriptContext.Provider value={script}>
        {children}
      </ScriptContext.Provider>
    </FunctionContext.Provider>
  )
}
