import { use } from 'react'
import { useParam } from '@/hooks'
import { ObjectContext, ParamsContext, ProjectContext } from '@/contexts'

/**
 * `<Script>` 컴포넌트 내부에 일반 매개변수를 정의합니다.
 * children이 없는 경우 null이 매개변수로 채워집니다.
 * 이 컴포넌트는 `<Script>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <SpriteObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='when_some_key_pressed'>
 *             <Param />
 *             <Param value='q' />
 *           </Script>
 *         </Statement>
 *       </SpriteObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function Param({ value = null }: {
  value?: unknown
}) {
  const params = use(ParamsContext)
  if (!params) throw TypeError('<Param> 컴포넌트는 <Script> 또는 <Statement> 내부에서 사용해야 합니다.')

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
 * `<Script>` 컴포넌트 내부에 변수 매개변수를 정의합니다.
 * 이 컴포넌트는 `<Script>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Variable name='전역변수' value='모든 곳에서 액세스 가능' />
 *     <Scene name='장면 1'>
 *       <SpriteObject name='엔트리봇'>
 *         <Statement>
 *           <Script type='set_variable'>
 *             <VariableParam name='전역변수' />
 *             <Param value='1' />
 *             <Param />
 *           </Script>
 *         </Statement>
 *       </SpriteObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function VariableParam({ name }: {
  name: string
}) {
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

export function PictureParam({ name }: {
  name: string
}) {
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

export function SoundParam({ name }: {
  name: string
}) {
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
