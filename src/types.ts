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

export type ObjectType = 'sprite' | 'textBox'
export type RotateMethod = 'free' | 'vertical' | 'none'

export interface EntryObjectType {
  id: string
  name: string
  lock: boolean
  scene: string
  script: string
  selectedPictureId?: string
  sprite: SpriteType
  entity: EntityType
  objectType: ObjectType
  rotateMethod: RotateMethod
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

export type FunctionType = 'normal' | 'value'

export interface EntryFunctionType {
  id: string
  type: FunctionType
  useLocalVariables: boolean
  localVariables?: LocalVariableType[]
  content: string
}

/**
 * @todo 타입지정
 */
export type TableType = object

export interface LocalVariableType {
  id: string
  name: string
  value: unknown
}

export interface SpriteType {
  pictures: PictureType[]
  sounds: SoundType[]
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

export interface PictureType {
  id: string
  name: string
  fileurl: string
  thumbUrl: string
  imageType: string
  dimension: DimensionType
}

export interface SoundType {
  id: string
  name: string
  fileurl: string
  duration: number
  ext: string
}

export interface DimensionType {
  width: number
  height: number
}
