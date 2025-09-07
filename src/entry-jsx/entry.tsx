import { Children, createContext, isValidElement, use, useRef } from 'react'
import type { EntryObjectType, ProjectType, ScriptType, VariableType } from '.'
import generateHash from './hash'

/**
 * 정해진 길이로 만들어진 무작위 id를 리턴하는 hook입니다.
 * @param length 무작위 id의 길이
 * @returns 정해진 길이로 만들어진 무작위 id
 */
function useEntryId(length = 4) {
  const idRef = useRef('')
  return idRef.current ||= generateHash(length)
}

/**
 * 이 컴포넌트는 jsxToProject() 내부 구현을 위해서만 사용됩니다. 이 컴포넌트를 직접 사용하지 마세요.
 * @private
 */
export const DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT = createContext<object | null>(null)

const ProjectContext = createContext<ProjectType | null>(null)
const SceneContext = createContext<string | null>(null)
const ObjectContext = createContext<EntryObjectType | null>(null)
const ScriptContext = createContext<ScriptType[][] | null>(null)
const ParamsContext = createContext<any[] | null>(null)
const StatementContext = createContext<ScriptType[] | null>(null)

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
 *       ...
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

  const i = project.scenes.findIndex(v => v.id == id)
  if (i >= 0) project.scenes.splice(i, 1)

  project.scenes.push({ id, name })

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
 *         ...
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function EntryObject({ name, children }: React.PropsWithChildren<{
  name: string
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
    scene,
    get script() {
      return JSON.stringify(script)
    },
    selectedPictureId: null,
  }

  const i = project.objects.findIndex(v => v.id == id)
  if (i >= 0) project.objects.splice(i, 1)

  project.objects.push(object)

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

  const statement = useRef<ScriptType[]>([]).current

  const i = script.indexOf(statement)
  if (i >= 0) script.splice(i, 1)

  script.push(statement)

  return (
    <StatementContext value={statement}>
      {children}
    </StatementContext>
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
}: React.PropsWithChildren<Partial<Omit<ScriptType, 'type'>> & { type: string }>) {
  const statement = use(StatementContext)
  if (!statement) throw TypeError('<Script> 컴포넌트는 <Statement> 내부에서 사용해야 합니다.')

  const id = useEntryId()

  const script = useRef<ScriptType>({
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
  }).current

  const i = statement.indexOf(script)
  if (i >= 0) statement.splice(i, 1)

  statement.push(script)

  return (
    <ScriptContext value={script.statements}>
      <ParamsContext value={script.params}>
        {children}
      </ParamsContext>
    </ScriptContext>
  )
}

const expectedParams: (string | React.JSXElementConstructor<any>)[] = [ Script, VariableId ]

function registerParam(child: React.ReactNode) {
  if (isValidElement(child)) {
    if (expectedParams.includes(child.type)) return child
    else console.warn('<Param> 컴포넌트의 자식으로 <Script>가 아닌 요소가 들어왔습니다. 만약 React.Fragment(<>)을 사용하고 있다면, 대신 자식 요소를 직접 넣어주세요.')
  }

  return <ParamRegister>{child}</ParamRegister>
}

/**
 * `<Script>` 컴포넌트 내부에 매개변수를 정의합니다. children이 없는 경우 null이 매개변수로 채워집니다. 이 컴포넌트는 `<Script>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <EntryObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='when_some_key_pressed'>
 *             <Param />
 *             <Param>q</Param>
 *           </Script>
 *         </Statement>
 *       </EntryObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Param({ children = null }: React.PropsWithChildren) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<Param> 컴포넌트는 <Script> 내부에서 사용해야 합니다.')

  const count = Children.count(children)
  if (count > 1) throw TypeError('<Param> 컴포넌트에는 한 개 이하의 자식이 필요합니다. 만약 JSX 중괄호 문법({ ... })을 사용하고 있다면, 대신 템플릿 문자열({`${...}`}) 자체를 자식으로 넘겨주세요.')

  return (
    <StatementContext value={params}>
      {count ? Children.map(children, registerParam) : <ParamRegister>{null}</ParamRegister>}
    </StatementContext>
  )
}

const paramsMap = new WeakMap<unknown[], symbol[]>()

/**
 * `<Param>`으로 일반 유형의 매개변수를 지정할 때 사용되는 컴포넌트입니다. 이 컴포넌트는 `<StatementContext>`의 자식으로 사용해야 합니다.
 * @private
 */
function ParamRegister({ children }: React.PropsWithChildren) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<ParamRegister> 컴포넌트는 <ParamsContext> 내부에서 사용해야 합니다. 이는 Entry.jsx 내부 버그입니다.')

  const symbol = useRef(Symbol('param')).current

  const paramSymbols = paramsMap.get(params) || []
  paramsMap.set(params, paramSymbols)

  const i = paramSymbols.indexOf(symbol)
  if (i >= 0) {
    params.splice(i, 1)
    paramSymbols.splice(i, 1)
  }

  params.push(children)
  paramSymbols.push(symbol)
  
  return null
}

export function Variable({
  name,
  value,
  visible = false,
  x = 0,
  y = 0,
  isCloud = false,
  isRealTime = false,
  cloudDate = false,
}: Partial<Omit<VariableType, 'name' | 'value'>> & { name: string, value: string }) {
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

  const i = project.variables.findIndex(v => v.id == id)
  if (i >= 0) project.variables.splice(i, 1)

  project.variables.push(variable)

  return null
}

export function VariableId({ name }: { name: string }) {
  const project = use(ProjectContext)
  if (!project) throw TypeError('<VariableId> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const params = use(ParamsContext)
  if (!params) throw TypeError('<VariableId> 컴포넌트는 <Param> 내부에서 사용해야 합니다.')

  const symbol = useRef(Symbol('param')).current

  const paramSymbols = paramsMap.get(params) || []
  paramsMap.set(params, paramSymbols)

  const i = paramSymbols.indexOf(symbol)
  if (i >= 0) {
    params.splice(i, 1)
    paramSymbols.splice(i, 1)
  }

  const id = project.variables.find(v => v.name == name)?.id
  if (!id) throw TypeError(`'${name}' 변수를 찾지 못했습니다. <Variable> 컴포넌트는 <VariableId> 컴포넌트보다 위에 있어야 합니다.`)

  params.push(id)
  paramSymbols.push(symbol)
  
  return null
}
