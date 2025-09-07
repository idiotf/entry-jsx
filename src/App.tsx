import { Card, CardContent } from "@/components/ui/card";
import { APITester } from "./APITester";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";
import {
  EntryObject,
  jsxToProject,
  Param,
  Picture,
  Project,
  Scene,
  Script,
  Sound,
  Statement,
  Variable,
  VariableParam,
} from './entry-jsx';

export function App() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] [animation:spin_20s_linear_infinite]"
        />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardContent className="pt-6">
          <h1 className="text-5xl font-bold my-4 leading-tight">Bun + React</h1>
          <p>
            Edit{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">src/App.tsx</code> and
            save to test HMR
          </p>
          <APITester />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

function GetVariable({ name }: { name: string }) {
  return (
    <Script type='get_variable'>
      <VariableParam name={name} />
    </Script>
  )
}

console.log(JSON.stringify(jsxToProject(
  <Project name='250906_aqu3180 작품'>
    <Scene name='장면 1'>
      <EntryObject
        name='엔트리봇'
        x={0}
        y={0}
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

        <Variable name='개인변수' value={10} />

        <Statement>
          <Script type='when_run_button_click' />
          <Script type='repeat_basic'>
            <Script type='number'>
              <Param value='10' />
            </Script>
            <Param />

            <Statement>
              <Script type='move_direction'>
                <GetVariable name='개인변수' />
              </Script>
            </Statement>
          </Script>
        </Statement>
      </EntryObject>
    </Scene>
  </Project>
))) // -> { name: '250906_aqu3180 작품', objects: [ [Object] ], ... }
