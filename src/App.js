import * as React from 'react'
import {NextUIProvider} from "@nextui-org/react";
import TimerContext from './TimerContext'
import Tasks from './Tasks'
import matcha from './media/matcha.svg'
import lightning from './media/lightning.svg'
import Pomodoro from './Pomodoro';
import { checkEndTime } from './utils'

const timerTypes = [
  {
    id: "pomodoro",
    title: "Focus Time",
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



//Idea: Create a table list of the fully completed pomodoro timers with date
function App() {
  const [selectedTimer, setSelectedTimer] = React.useState("pomodoro")
  const [pomodorosCompleted, setPomodorosCompleted] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [nextUp, setNextUp] = React.useState({
    id: "",
    title: "",
    time: 0,
  })
  const checkIfEvery4th = (pomodorosCompleted + 1) % 4

  const checkNextSession = () => {
    const handleReturn = (timerIndex) => {
      return {
        title: timerTypes[timerIndex].title,
        id: timerTypes[timerIndex].id,
      }
    }
    if(selectedTimer === "pomodoro") {
      if(checkIfEvery4th===0) {
        return handleReturn(2)
      } 
      return handleReturn(1)
    }
    return handleReturn(0)
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
        nextUp,
        setNextUp,
        checkIfEvery4th, 
        checkNextSession,
        checkEndTime,
        }}>
        <div className="h-screen">
          <Pomodoro timerTypes={timerTypes}/>

        </div>
      </TimerContext.Provider>
    </NextUIProvider>
  );
}

export default App;
