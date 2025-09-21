import React, { useRef } from 'react'
import {
  SpriteObject,
  jsxToProject,
  Picture,
  Project,
  Scene,
  Sound,
  Statement,
  Script,
  Param,
} from '@/.'

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
        <SpriteObject
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
            width={144}
            height={246}
            selected
          />
          <Picture
            name='엔트리봇_걷기2'
            fileurl='/lib/entry-js/images/media/entrybot2.svg'
            width={144}
            height={246}
          />

          <Sound
            name='강아지 짖는 소리'
            fileurl='/lib/entry-js/images/media/bark.mp3'
            duration={1.3}
          />

          <Statement>
            <Script type='when_run_button_click' />
            <Script type='repeat_basic'>
              <Param value={10} />
              <Statement>
                <Script type='move_direction'>
                  <Param value={10} />
                </Script>
                <Script type='wait_until_true'>
                  <Script type='boolean_not'>
                    <Param />
                    <Script type='continue_repeat' />
                  </Script>
                </Script>
              </Statement>
            </Script>
          </Statement>
        </SpriteObject>
      </Scene>
    </Project>
  )
}

console.log(JSON.stringify(jsxToProject(<Main />)))
