export type * from './object'
export type * from './variable'
export type * from './message'
export type * from './function'
export type * from './scene'
export type * from './interface'
export type * from './table'

import type { ObjectData } from './object'
import type { VariableData } from './variable'
import type { MessageData } from './message'
import type { FunctionData } from './function'
import type { SceneData } from './scene'
import type { InterfaceState } from './interface'
import type { TableData } from './table'

export interface ProjectData {
  name?: string
  speed: number
  objects: ObjectData[]
  variables: VariableData[]
  messages: MessageData[]
  functions: FunctionData[]
  scenes: SceneData[]
  interface: InterfaceState
  tables: TableData[]
  aiUtilizeBlocks: string[]
  expansionBlocks: string[]
  hardwareLiteBlocks: string[]
  externalModules: string[]
  externalModulesLite: string[]
}

export interface ScriptData {
  id: string
  type: string
  params: unknown[]
  statements: ScriptData[][]
  x: number
  y: number
  deletable: number | false
  copyable: boolean
  movable: null
  emphasized: boolean
  readOnly: null
  assemble: boolean
  extensions: string[]
}
