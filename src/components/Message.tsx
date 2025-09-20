import { useContext } from 'react'
import { useEntryId, useParam } from '@/internal/hooks'
import { ProjectContext } from '@/internal/contexts'

export function Message({ id, name }: {
  id?: string
  name: string
}) {
  const project = useContext(ProjectContext)
  if (!project) throw TypeError('<Message> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ||= defaultId
  useParam(project.messages, { value: { id, name } })

  return null
}
