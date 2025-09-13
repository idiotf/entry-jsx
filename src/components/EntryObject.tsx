import React, { use } from 'react'
import { useEntryId, useParam } from '@/hooks'
import { SceneContext, ProjectContext, ObjectContext, ScriptContext } from '@/contexts'
import type { ObjectType, RotateMethod, ScriptType, EntryObjectType, PictureType, SoundType } from '@/types'

export type EntryObjectProps = React.PropsWithChildren<{
  id?: string
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
}>

/**
 * 오브젝트에 대한 정보를 정의할 때 사용되는 컴포넌트입니다.
 * 이 컴포넌트는 `<Scene>`의 자식으로 사용해야 합니다.
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
  id,
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
}: EntryObjectProps) {
  const scene = use(SceneContext)
  if (!scene) throw TypeError('<EntryObject> 컴포넌트는 <Scene> 내부에서 사용해야 합니다.')

  const project = use(ProjectContext)
  if (!project) throw TypeError('<EntryObject> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ||= defaultId

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
