import { createContext } from 'react'
import type { FunctionData, ObjectData, ProjectData, BlockData } from '@/types'

/**
 * 이 컨텍스트는 `jsxToProject()` 내부 구현을 위해서 사용됩니다.
 * @private
 */
export const RootProjectContext = createContext<object | null>(null)

/**
 * 이 컨텍스트는 `<Project>` 컴포넌트의 작품 객체를 참조하는 데 사용됩니다.
 * @private
 */
export const ProjectContext = createContext<ProjectData | null>(null)

/**
 * 이 컨텍스트는 `<Scene>` 컴포넌트의 장면 id를 읽는 데 사용됩니다.
 * @private
 */
export const SceneContext = createContext<string | null>(null)

/**
 * 이 컨텍스트는 `<SpriteObject>`, `<TextBoxObject>` 컴포넌트의 오브젝트 객체를 참조하는 데 사용됩니다.
 * @private
 */
export const ObjectContext = createContext<ObjectData | null>(null)

/**
 * 이 컨텍스트는 `<SpriteObject>`, `<TextBoxObject>`, `<Block>` 등 여러 statement 배열을 참조하는 데 사용됩니다.
 * @private
 */
export const ScriptContext = createContext<BlockData[][] | null>(null)

/**
 * 이 컨텍스트는 `<Statement>`, `<Block>` 등 특정 파라미터를 넣을 수 있는 배열을 참조하는 데 사용됩니다.
 * @private
 */
export const ParamsContext = createContext<unknown[] | null>(null)

/**
 * 이 컨텍스트는 `<NormalFunc>`, `<ValueFunc>` 컴포넌트의 함수 객체를 참조하는 데 사용됩니다.
 * @private
 */
export const FunctionContext = createContext<FunctionData | null>(null)
