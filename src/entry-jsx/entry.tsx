import { createContext, use, useRef } from 'react'
import type {
  EntryObjectType,
  ObjectType,
  PictureType,
  ProjectType,
  RotateMethod,
  ScriptType,
  SoundType,
  VariableType,
} from '.'
import generateHash from './hash'

/**
 * 정해진 길이로 만들어진 무작위 id를 리턴하는 hook입니다.
 * @private
 * @param length 무작위 id의 길이
 * @returns 정해진 길이로 만들어진 무작위 id
 */
function useEntryId(length = 4) {
  const idRef = useRef('')
  return idRef.current ||= generateHash(length)
}

/**
 * 배열마다 중복 값이 들어가는 것을 방지하기 위한 `WeakMap`입니다.
 * @private
 */
const paramsMap = new WeakMap<any[], symbol[]>()

/**
 * 배열에 특정 항목을 중복 없이 넣어주는 hook입니다.
 * @private
 * @param params 매개변수가 들어갈 배열
 * @param param 배열에 들어갈 값의 descriptor
 */
function useParam(params: any[], param: PropertyDescriptor & ThisType<any>) {
  const symbol = useRef(Symbol('param')).current

  const paramSymbols = paramsMap.get(params) || []
  paramsMap.set(params, paramSymbols)

  const i = paramSymbols.indexOf(symbol)
  if (i >= 0) {
    params.splice(i, 1)
    paramSymbols.splice(i, 1)
  }

  Object.defineProperty(params, params.length, { ...param, configurable: true })
  paramSymbols.push(symbol)
}

/**
 * 이 컨텍스트는 jsxToProject() 내부 구현을 위해서만 사용됩니다. 이 컨텍스트를 직접 사용하지 마세요.
 * @private
 */
export const DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT = createContext<object | null>(null)

const ProjectContext = createContext<ProjectType | null>(null)
const SceneContext = createContext<string | null>(null)
const ObjectContext = createContext<EntryObjectType | null>(null)
const ScriptContext = createContext<ScriptType[][] | null>(null)
const ParamsContext = createContext<any[] | null>(null)

/**
 * 작품에 대한 정보를 정의할 때 사용되는 컴포넌트입니다. 이 컴포넌트는 `jsxToProject()` 함수의 매개변수에 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     ...
 *   </Project>
 * )
 */
export function Project({
  name,
  speed = 60,
  interface: entryInterface = {},
  expansionBlocks = [],
  aiUtilizeBlocks = [],
  hardwareLiteBlocks = [],
  externalModules = [],
  externalModulesLite = [],
  children,
}: React.PropsWithChildren<{
  name: string
  speed?: number
  interface?: object
  expansionBlocks?: string[]
  aiUtilizeBlocks?: string[]
  hardwareLiteBlocks?: string[]
  externalModules?: string[]
  externalModulesLite?: string[]
}>) {
  const project = use(DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT)
  if (!project) throw TypeError('<Project> 컴포넌트는 jsxToProject() 내부에서 사용해야 합니다.')

  const assignedProject = Object.assign(project, {
    name,
    interface: entryInterface,
    scenes: [],
    objects: [],
    variables: [],
    messages: [],
    functions: [],
    tables: [],
    expansionBlocks,
    aiUtilizeBlocks,
    hardwareLiteBlocks,
    speed,
    externalModules,
    externalModulesLite,
  } satisfies ProjectType)

  return (
    <ProjectContext value={assignedProject}>
      {children}
    </ProjectContext>
  )
}

/**
 * 장면에 대한 정보와 장면 내부의 오브젝트를 정의할 때 사용되는 컴포넌트입니다. 이 컴포넌트는 `<Project>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         ...
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Scene({ name, children }: React.PropsWithChildren<{
  name: string
}>) {
  const project = use(ProjectContext)
  if (!project) throw TypeError('<Scene> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const id = useEntryId()
  useParam(project.scenes, { value: { id, name } })

  return (
    <SceneContext value={id}>
      {children}
    </SceneContext>
  )
}

/**
 * 오브젝트에 대한 정보를 정의할 때 사용되는 컴포넌트입니다. 이 컴포넌트는 `<Scene>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Statement>
 *           ...
 *         </Statement>
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function EntryObject({
  name,
  lock = false,
  objectType = 'sprite',
  rotateMethod = 'free',
  x = 0,
  y = 0,
  scaleX = 1,
  scaleY = 1,
  rotation = 0,
  direction = 90,
  width = 0,
  height = 0,
  font = 'undefinedpx ',
  visible = false,
  regX = width / 2,
  regY = height / 2,
  children,
}: React.PropsWithChildren<{
  name: string
  lock?: boolean
  objectType?: ObjectType
  rotateMethod?: RotateMethod
  x?: number
  y?: number
  regX?: number
  regY?: number
  scaleX?: number
  scaleY?: number
  rotation?: number
  direction?: number
  width?: number
  height?: number
  font?: string
  visible?: boolean
}>) {
  const scene = use(SceneContext)
  if (!scene) throw TypeError('<EntryObject> 컴포넌트는 <Scene> 내부에서 사용해야 합니다.')

  const project = use(ProjectContext)
  if (!project) throw TypeError('<EntryObject> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const id = useEntryId()

  const script: ScriptType[][] = []
  const object: EntryObjectType = {
    id,
    name,
    lock,
    scene,
    get script() {
      return JSON.stringify(script)
    },
    sprite: {
      pictures: [],
      sounds: [],
    },
    entity: {
      x, y,
      regX, regY,
      scaleX, scaleY,
      rotation, direction,
      width, height,
      font,
      visible,
    },
    objectType,
    rotateMethod,
    selectedPictureId: null,
  }

  useParam(project.objects, { value: object })

  return (
    <ObjectContext value={object}>
      <ScriptContext value={script}>
        {children}
      </ScriptContext>
    </ObjectContext>
  )
}

/**
 * `<EntryObject>` 또는 `<Script>` 컴포넌트 내부에서 단일 스크립트 statement를 정의합니다. 이 컴포넌트는 `<Script>` 또는 `<EntryObject>`의 자식으로 사용해야 합니다.
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
  const script = use(ScriptContext)
  if (!script) throw TypeError('<Statement> 컴포넌트는 <Script> 또는 <EntryObject> 내부에서 사용해야 합니다.')

  const statement: ScriptType[] = []

  useParam(script, { value: statement })

  return (
    <ParamsContext value={statement}>
      {children}
    </ParamsContext>
  )
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
}: React.PropsWithChildren<Partial<Omit<ScriptType, 'type'>> & {
  type: string
}>) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<Script> 컴포넌트는 <Script> 또는 <Statement> 내부에서 사용해야 합니다.')

  const id = useEntryId()

  const script: ScriptType = {
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
    <ScriptContext value={script.statements}>
      <ParamsContext value={script.params}>
        {children}
      </ParamsContext>
    </ScriptContext>
  )
}

/**
 * `<Script>` 컴포넌트 내부에 일반 매개변수를 정의합니다. children이 없는 경우 null이 매개변수로 채워집니다. 이 컴포넌트는 `<Script>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='when_some_key_pressed'>
 *             <Param />
 *             <Param value='q' />
 *           </Script>
 *         </Statement>
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Param({ value = null }: {
  value?: any
}) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<Param> 컴포넌트는 <Script> 내부에서 사용해야 합니다.')

  useParam(params, { value })
  return null
}

export function ObjectParam({ name }: {
  name: string
}) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<ObjectParam> 컴포넌트는 <Script> 내부에서 사용해야 합니다.')

  const project = use(ProjectContext)
  if (!project) throw TypeError('<ObjectParam> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  useParam(params, {
    get() {
      const id = project.objects.find(v => v.name == name)?.id
      if (!id) throw TypeError(`'${name}' 오브젝트를 찾지 못했습니다.`)
      return id
    },
  })

  return null
}

/**
 * `<Project>` 또는 `<EntryObject>` 컴포넌트 내부에 변수를 정의합니다. `<EntryObject>` 내부에 있는 경우 개인변수로 설정됩니다. 이 컴포넌트는 `<Project>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Variable name='전역변수' value='모든 곳에서 액세스 가능' />
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Variable name='개인변수' value='엔트리봇만 액세스 가능' />
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Variable({
  name,
  value,
  visible = false,
  x = 0,
  y = 0,
  isCloud = false,
  isRealTime = false,
  cloudDate = false,
}: Partial<Omit<VariableType, 'name' | 'value'>> & { name: string, value: any }) {
  const project = use(ProjectContext)
  if (!project) throw TypeError('<Variable> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const id = useEntryId()
  const object = use(ObjectContext)

  const variable: VariableType = {
    id,
    name,
    value,
    visible,
    object: object?.id || null,
    x,
    y,
    isCloud,
    isRealTime,
    cloudDate,
  }

  useParam(project.variables, { value: variable })

  return null
}

/**
 * `<Script>` 컴포넌트 내부에 변수 매개변수를 정의합니다. 이 컴포넌트는 `<Script>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Variable name='전역변수' value='모든 곳에서 액세스 가능' />
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='set_variable'>
 *             <VariableParam name='전역변수' />
 *             <Param value='1' />
 *             <Param />
 *           </Script>
 *         </Statement>
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function VariableParam({ name }: { name: string }) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<VariableParam> 컴포넌트는 <Script> 내부에서 사용해야 합니다.')

  const project = use(ProjectContext)
  if (!project) throw TypeError('<VariableParam> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  useParam(params, {
    get() {
      const id = project.variables.find(v => v.name == name)?.id
      if (!id) throw TypeError(`'${name}' 변수를 찾지 못했습니다.`)
      return id
    },
  })

  return null
}

export function Picture({ name, fileurl, thumbUrl = fileurl, imageType, width, height, selected }: {
  name: string
  fileurl: string
  thumbUrl?: string
  imageType: string
  width: number
  height: number
  selected?: boolean
}) {
  const object = use(ObjectContext)
  if (!object) throw TypeError('<Picture> 컴포넌트는 <EntryObject> 내부에서 사용해야 합니다.')

  const id = useEntryId()
  const picture: PictureType = {
    id,
    name,
    fileurl,
    thumbUrl,
    imageType,
    dimension: { width, height },
  }

  useParam(object.sprite.pictures, { value: picture })
  if (selected) object.selectedPictureId = id

  return null
}

export function PictureParam({ name }: { name: string }) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<PictureParam> 컴포넌트는 <Script> 내부에서 사용해야 합니다.')

  const object = use(ObjectContext)
  if (!object) throw TypeError('<PictureParam> 컴포넌트는 <EntryObject> 내부에서 사용해야 합니다.')

  useParam(params, {
    get() {
      const id = object.sprite.pictures.find(v => v.name == name)?.id
      if (!id) throw TypeError(`'${name}' 모양을 찾지 못했습니다.`)
      return id
    },
  })

  return null
}

export function Sound({ name, fileurl, duration, ext }: {
  name: string
  fileurl: string
  duration: number
  ext: string
}) {
  const object = use(ObjectContext)
  if (!object) throw TypeError('<Sound> 컴포넌트는 <EntryObject> 내부에서 사용해야 합니다.')

  const id = useEntryId()
  const sound: SoundType = {
    id,
    name,
    fileurl,
    duration,
    ext,
  }

  useParam(object.sprite.sounds, { value: sound })

  return null
}

export function SoundParam({ name }: { name: string }) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<SoundParam> 컴포넌트는 <Script> 내부에서 사용해야 합니다.')

  const object = use(ObjectContext)
  if (!object) throw TypeError('<SoundParam> 컴포넌트는 <EntryObject> 내부에서 사용해야 합니다.')

  useParam(params, {
    get() {
      const id = object.sprite.sounds.find(v => v.name == name)?.id
      if (!id) throw TypeError(`'${name}' 소리를 찾지 못했습니다.`)
      return id
    },
  })

  return null
}
