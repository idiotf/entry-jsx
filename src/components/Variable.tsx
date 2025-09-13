import { use } from 'react'
import type { VariableType } from '@/types'
import { useEntryId, useParam } from '@/hooks'
import { ProjectContext, ObjectContext } from '@/contexts'

export interface VariableProps extends Partial<Omit<VariableType, 'name' | 'value'>> {
  name: string
  value: unknown
}

/**
 * `<Project>` 또는 `<EntryObject>` 컴포넌트 내부에 변수를 정의합니다.
 * `<EntryObject>` 내부에 있는 경우 개인변수로 설정됩니다.
 * 이 컴포넌트는 `<Project>`의 자식으로 사용해야 합니다.
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
}: VariableProps) {
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
