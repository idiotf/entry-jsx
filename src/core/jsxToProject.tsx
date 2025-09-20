import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RootProjectContext } from '@/internal/contexts'
import type { ProjectData } from '@/types'

/**
 * JSX를 Project 객체로 변환해 줍니다.
 * @param children JSX로 만들어진 동기적인 `<Project>` 컴포넌트
 * @returns JSX에서 Project로 변환된 객체
 */
export function jsxToProject(children: React.ReactNode) {
  // 컴포넌트 내부 Context로 만들어진 작품이 저장되는 변수입니다.
  const project = {} as ProjectData

  // project 변수 내부의 속성이 변하도록 하기 위해 컴포넌트를 렌더링합니다.
  renderToStaticMarkup(
    <RootProjectContext.Provider value={project}>
      {children}
    </RootProjectContext.Provider>
  )

  // <Project> 컴포넌트를 사용했는지 검토합니다.
  if (!project.scenes) throw TypeError('jsxToProject() 내부에는 <Project> 컴포넌트가 필요합니다.')

  // getter에서 발생하는 오류를 테스트합니다.
  JSON.stringify(project)

  return project
}
