import React, { use } from 'react'
import { useEntryId, useParam } from '@/hooks'
import { ProjectContext, SceneContext } from '@/contexts'

export type SceneProps = React.PropsWithChildren<{
  id?: string
  name: string
}>

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
export function Scene({ id, name, children }: SceneProps) {
  const project = use(ProjectContext)
  if (!project) throw TypeError('<Scene> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ||= defaultId
  useParam(project.scenes, { value: { id, name } })

  return (
    <SceneContext value={id}>
      {children}
    </SceneContext>
  )
}
