import { createContext } from 'react'
import type { EntryObjectType, ProjectType, ScriptType } from '@/types'

/**
 * 이 컨텍스트는 `jsxToProject()` 내부 구현을 위해서만 사용됩니다. 이 컨텍스트를 직접 사용하지 마세요.
 * @private
 */
export const DO_NOT_USE_OR_YOU_WILL_BE_FIRED_ROOT_PROJECT_CONTEXT = createContext<object | null>(null)

/**
 * 이 컨텍스트는 `<Project>` 컴포넌트의 작품 객체를 참조하는 데 사용됩니다.
 * @private
 */
export const ProjectContext = createContext<ProjectType | null>(null)

/**
 * 이 컨텍스트는 `<Scene>` 컴포넌트의 장면 id를 읽는 데 사용됩니다.
 * @private
 */
export const SceneContext = createContext<string | null>(null)

/**
 * 이 컨텍스트는 `<EntryObject>` 컴포넌트의 오브젝트 객체를 참조하는 데 사용됩니다.
 * @private
 */
export const ObjectContext = createContext<EntryObjectType | null>(null)

/**
 * 이 컨텍스트는 `<EntryObject>`, `<Script>` 등 여러 statement 배열을 참조하는 데 사용됩니다.
 * @private
 */
export const ScriptContext = createContext<ScriptType[][] | null>(null)

/**
 * 이 컨텍스트는 `<Statement>`, `<Script>` 등 특정 파라미터를 넣을 수 있는 배열을 참조하는 데 사용됩니다.
 * @private
 */
export const ParamsContext = createContext<unknown[] | null>(null)
