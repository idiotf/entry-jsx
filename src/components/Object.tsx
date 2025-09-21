import React, { useContext } from 'react'
import { useEntryId, useParam } from '@/internal/hooks'

import {
  SceneContext,
  ProjectContext,
  ObjectContext,
  ScriptContext,
} from '@/internal/contexts'

import type {
  ObjectType,
  RotateMethod,
  ScriptData,
  ObjectData,
  PictureData,
  SoundData,
} from '@/types'

export interface SpriteObjectProps {
  id?: string
  name: string
  objectType?: ObjectType
  lock?: boolean
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
  visible?: boolean
  selected?: boolean
}

/**
 * 오브젝트에 대한 정보를 정의할 때 사용되는 컴포넌트입니다.
 * 이 컴포넌트는 `<Scene>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <SpriteObject name='엔트리봇'>
 *         <Statement>
 *           ...
 *         </Statement>
 *       </SpriteObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function SpriteObject({
  id,
  name,
  lock = false,
  rotateMethod = 'free',
  x = 0,
  y = 0,
  scaleX = 1,
  scaleY = 1,
  rotation = 0,
  direction = 90,
  width = 0,
  height = 0,
  visible = false,
  regX = width / 2,
  regY = height / 2,
  selected,
  children,
}: React.PropsWithChildren<SpriteObjectProps>) {
  const scene = useContext(SceneContext)
  if (!scene) throw TypeError('<SpriteObject> 컴포넌트는 <Scene> 내부에서 사용해야 합니다.')

  const project = useContext(ProjectContext)
  if (!project) throw TypeError('<SpriteObject> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ??= defaultId

  const script: ScriptData[][] = []
  const object: ObjectData = {
    id,
    name,
    objectType: 'sprite',
    scene,
    lock,
    rotateMethod,
    entity: {
      x, y,
      regX, regY,
      scaleX, scaleY,
      rotation, direction,
      width, height,
      font: 'undefinedpx ',
      visible,
    },
    get script() {
      return JSON.stringify(script)
    },
    sprite: {
      pictures: [],
      sounds: [],
    },
  }

  useParam(project.objects, { value: object })
  if (selected) project.interface.object = id

  return (
    <ObjectContext.Provider value={object}>
      <ScriptContext.Provider value={script}>
        {children}
      </ScriptContext.Provider>
    </ObjectContext.Provider>
  )
}

export interface TextBoxObjectProps extends SpriteObjectProps {
  font?: string
  text?: string
  colour?: string
  textAlign?: 0 | 1 | 2
  lineBreak?: boolean
  bgColor?: string
  underLine?: boolean
  strike?: boolean
  fontSize?: number
}

/**
 * 오브젝트에 대한 정보를 정의할 때 사용되는 컴포넌트입니다.
 * 이 컴포넌트는 `<Scene>`의 자식으로 사용해야 합니다.
 * @example
 * const project = jsxToProject(
 *   <Project name='멋진 작품'>
 *     <Scene name='장면 1'>
 *       <TextBoxObject name='글상자'>
 *         <Statement>
 *           ...
 *         </Statement>
 *       </TextBoxObject>
 *     </Scene>
 *   </Project>
 * )
 */
export function TextBoxObject({
  id,
  name,
  text = '글상자',
  lock = false,
  rotateMethod = 'free',
  x = 0,
  y = 0,
  scaleX = 1,
  scaleY = 1,
  rotation = 0,
  direction = 90,
  width = 0,
  height = 0,
  visible = false,
  regX = width / 2,
  regY = height / 2,
  colour = '#000000',
  textAlign = 0,
  lineBreak = false,
  bgColor = '#ffffff',
  underLine = false,
  strike = false,
  fontSize = 20,
  font = `${fontSize}px Nanum Gothic`,
  selected,
  children,
}: React.PropsWithChildren<TextBoxObjectProps>) {
  const scene = useContext(SceneContext)
  if (!scene) throw TypeError('<TextBoxObject> 컴포넌트는 <Scene> 내부에서 사용해야 합니다.')

  const project = useContext(ProjectContext)
  if (!project) throw TypeError('<TextBoxObject> 컴포넌트는 <Project> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ??= defaultId

  const script: ScriptData[][] = []
  const object: ObjectData = {
    id,
    name,
    text,
    objectType: 'textBox',
    scene,
    lock,
    rotateMethod,
    entity: {
      x, y,
      regX, regY,
      scaleX, scaleY,
      rotation, direction,
      width, height,
      font, fontSize,
      text, textAlign,
      colour, bgColor,
      underLine, strike,
      lineBreak, visible,
    },
    get script() {
      return JSON.stringify(script)
    },
    sprite: {
      pictures: [],
      sounds: [],
    },
  }

  useParam(project.objects, { value: object })
  if (selected) project.interface.object = id

  return (
    <ObjectContext.Provider value={object}>
      <ScriptContext.Provider value={script}>
        {children}
      </ScriptContext.Provider>
    </ObjectContext.Provider>
  )
}

export interface PictureProps {
  id?: string
  name: string
  fileurl: string
  thumbUrl?: string
  imageType?: string
  width: number
  height: number
  selected?: boolean
}

const imageTypeRegex = /(?<=\.)[^.]*$/
const soundExtRegex = /\.[^.]*$/

export function Picture({
  id,
  name,
  fileurl,
  thumbUrl = fileurl,
  imageType = fileurl.match(imageTypeRegex)?.[0] || 'png',
  width,
  height,
  selected,
}: PictureProps) {
  const object = useContext(ObjectContext)
  if (object?.objectType != 'sprite') throw TypeError('<Picture> 컴포넌트는 <SpriteObject> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ??= defaultId

  const picture: PictureData = {
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

export interface SoundProps {
  id?: string
  name: string
  fileurl: string
  duration: number
  ext?: string
}

export function Sound({
  id,
  name,
  fileurl,
  duration,
  ext = fileurl.match(soundExtRegex)?.[0] || '.mp3',
}: SoundProps) {
  const object = useContext(ObjectContext)
  if (!object) throw TypeError('<Sound> 컴포넌트는 <SpriteObject> 또는 <TextBoxObject> 내부에서 사용해야 합니다.')

  const defaultId = useEntryId()
  id ??= defaultId

  const sound: SoundData = {
    id,
    name,
    fileurl,
    duration,
    ext,
  }

  useParam(object.sprite.sounds, { value: sound })

  return null
}
