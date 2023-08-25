import logo from './logo.svg';
import * as React from 'react'
import {NextUIProvider} from "@nextui-org/react";
import Timer from './Timer'
import TabItems from './TabItems'
import TimerContext from './TimerContext'
import {Card, CardBody} from "@nextui-org/react";
import {Tabs, Tab} from "@nextui-org/react";
import matcha from './media/matcha.svg'
import lightning from './media/lightning.svg'


const timerTypes = [
  {
    id: "pomodoro",
    title: "Focus",
    countDownTime: 1500,
    favicon: lightning
  },
  {
    id: "short break",
    title: "Short Break",
    countDownTime: 300,
    favicon: matcha
  },
  {
    id: "long break",
    title: "Long Break",
    countDownTime: 1200,
    favicon: matcha
  },
]

function checkEndTime (secondsLeft) {
    const now = new Date()
      const time = now.getTime()
      const remainingTime = time + (secondsLeft * 1000)
      const endTime = new Date()
      endTime.setTime(remainingTime)
      return( endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        }) )
  }

//Idea: Create a table list of the fully completed pomodoro timers with date
function App() {
  const [selectedTimer, setSelectedTimer] = React.useState("pomodoro")
  const [pomodorosCompleted, setPomodorosCompleted] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [nextUp, setNextUp] = React.useState({
    title: "",
    time: 0,
  })
  const checkIfEvery4th = (pomodorosCompleted + 1) % 4

  const checkNextSession = () => {
    if(selectedTimer === "pomodoro") {
      if(checkIfEvery4th===0) {
        return timerTypes[2].title
      } 
      return timerTypes[1].title
    }
    return timerTypes[0].title
  }

  return (
    <NextUIProvider>
      <TimerContext.Provider value={{
        selectedTimer, 
        setSelectedTimer,
        pomodorosCompleted,
        setPomodorosCompleted,
        isRunning,
        setIsRunning,
        setNextUp,
        checkIfEvery4th, 
        checkNextSession,
        checkEndTime
        }}>
        <div className="flex flex-col gap-0 items-center py-24" style={{height:"100vh"}}>
          <Card
            className="w-[512px] pb-4 z-10"
            shadow="none"
          >
            <CardBody>
              <Tabs className="flex flex-col items-center" key="primary" color="primary" aria-label="Tabs colors" radius="full" selectedKey={selectedTimer}
              onSelectionChange={setSelectedTimer}>
              {timerTypes.map((timer) => {
                return <Tab key={timer.id} title={timer.title} />
              })}
              </Tabs>
            
              {timerTypes.map((timer) => {
                return <Timer id={timer.id} favicon={timer.favicon} countDownTime={timer.countDownTime}/>
              })}

            </CardBody>
          </Card>
          {isRunning && <Card
            className="bg-[#E7E7E7] w-[512px] z-0 -mt-8 mb-8 border-none"
            shadow="none"
          >
            <CardBody
              className="flex flex-row space-x-2 justify-center pb-4 pt-12 text-l"
            >
              {`Next up: ${nextUp.title} at`}  
              <b>&nbsp;{nextUp.time}</b>
              {selectedTimer==="pomodoro" ? <img className="h-6" src={matcha}></img> : <img className="h-6" src={lightning}></img>}
              
            </CardBody>
          </Card>}
        </div>
      </TimerContext.Provider>
    </NextUIProvider>
  );
}

export default App;
