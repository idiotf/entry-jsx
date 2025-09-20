import React, { useContext } from 'react'
import { RootProjectContext, ProjectContext } from '@/internal/contexts'
import type { ProjectData } from '@/types'

export type ProjectProps = React.PropsWithChildren<{
  name?: string
  speed?: number
  interface?: object
  expansionBlocks?: string[]
  aiUtilizeBlocks?: string[]
  hardwareLiteBlocks?: string[]
  externalModules?: string[]
  externalModulesLite?: string[]
}>

/**
 * 작품에 대한 정보를 정의할 때 사용되는 컴포넌트입니다.
 * 이 컴포넌트는 `jsxToProject()` 함수의 매개변수에 사용해야 합니다.
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
}: ProjectProps) {
  const obj = useContext(RootProjectContext)
  if (!obj) throw TypeError('<Project> 컴포넌트는 jsxToProject() 내부에서 사용해야 합니다.')
  
  const project: ProjectData = {
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
  }

  return (
    <ProjectContext.Provider value={Object.assign(obj, project)}>
      {children}
    </ProjectContext.Provider>
  )
}
