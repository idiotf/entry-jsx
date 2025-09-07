import { renderToStaticMarkup } from 'react-dom/server'
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT } from './entry'

export interface ProjectType {
  name: string
  interface: object
  scenes: SceneType[]
  objects: EntryObjectType[]
  variables: VariableType[]
  messages: MessageType[]
  functions: EntryFunctionType[]
  tables: TableType[]
  expansionBlocks: string[]
  aiUtilizeBlocks: string[]
  hardwareLiteBlocks: string[]
  speed: number
  externalModules: string[]
  externalModulesLite: string[]
}

export interface EntryObjectType {
  id: string
  name: string
  scene: string
  script: string
  selectedPictureId: string | null
}

export interface SceneType {
  id: string
  name: string
}

export interface VariableType {
  id: string
  name: string
  value: unknown
  visible: boolean
  x: number
  y: number
  object: string | null
  isCloud: boolean
  isRealTime: boolean
  cloudDate: unknown
}

export interface MessageType {
  id: string
  name: string
}

export interface EntryFunctionType {
  id: string
  type: 'normal' | 'value'
  useLocalVariables: boolean
  localVariables?: LocalVariableType[]
  content: string
}

/**
 * @todo 타입지정
 */
export interface TableType {}

export interface LocalVariableType {
  id: string
  name: string
  value: unknown
}

export interface EntityType {
  x: number
  y: number
  regX: number
  regY: number
  scaleX: number
  scaleY: number
  rotation: number
  direction: number
  width: number
  height: number
  font: string
  visible: boolean
}

export interface ScriptType {
  id: string
  type: string
  params: unknown[]
  statements: ScriptType[][]
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


/**
 * JSX를 Project 객체로 변환해 줍니다.
 * @param children JSX로 만들어진 `<Project>` 컴포넌트
 * @returns JSX에서 Project로 변환된 객체
 */
export function jsxToProject(children: React.ReactNode) {
  // 컴포넌트 내부 Context로 만들어진 작품이 저장되는 변수입니다.
  const project = {}

  // project 변수를 변하도록 하기 위해 컴포넌트를 렌더링합니다.
  renderToStaticMarkup(
    <DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT value={project}>
      {children}
    </DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT>
  )

  return project as ProjectType
}

export { Project, Scene, EntryObject, Statement, Script, Param, Variable, VariableId } from './entry'
