import React, { useRef } from 'react'
import {
  EntryObject,
  jsxToProject,
  Picture,
  Project,
  Scene,
  Sound,
} from 'entry-jsx'

function Main() {
  const date = useRef(new Date).current
  const dateString = [
    date.getFullYear() % 100,
    date.getMonth() + 1,
    date.getDate(),
  ].map(v => (v + '').padStart(2, '0')).join('')

  return (
    <Project name={`${dateString}_작품`}>
      <Scene name='장면 1'>
        <EntryObject
          name='엔트리봇'
          width={144}
          height={246}
          scaleX={20 / 39}
          scaleY={20 / 39}
          visible
        >
          <Picture
            name='엔트리봇_걷기1'
            fileurl='/lib/entry-js/images/media/entrybot1.svg'
            imageType='svg'
            width={144}
            height={246}
            selected
          />
          <Picture
            name='엔트리봇_걷기2'
            fileurl='/lib/entry-js/images/media/entrybot2.svg'
            imageType='svg'
            width={144}
            height={246}
          />

          <Sound
            name='강아지 짖는 소리'
            fileurl='/lib/entry-js/images/media/bark.mp3'
            duration={1.3}
            ext='.mp3'
          />
        </EntryObject>
      </Scene>
    </Project>
  )
}

console.log(JSON.stringify(jsxToProject(<Main />), null, 2))
