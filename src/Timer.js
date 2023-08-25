import logo from './logo.svg';
import * as React from 'react'
import TimerContext from './TimerContext'
import sound from './media/UIclick.mp3'
import pomodoroSound from './media/Ping1.mp3'
import breakSound from './media/Softchime.mp3'
import {Button, CardBody} from "@nextui-org/react";

function formatTime(time) {
  const minute = Math.floor(time / 60)
  const seconds = time % 60
  return(`${minute}:${seconds.toString().padStart(2, '0')}`)
}

function Timer( {id, countDownTime, favicon} ) {
  const [seconds, setSeconds] = React.useState(countDownTime)
  const {selectedTimer, setSelectedTimer, pomodorosCompleted, setPomodorosCompleted, isRunning, setIsRunning, setNextUp, checkIfEvery4th, checkNextSession, checkEndTime} = React.useContext(TimerContext)
  const isSelected = selectedTimer === id
  const refTimer = React.useRef(null)
  //is there a way to clean this up?
  const buttonClickAudio = new Audio(sound)
  const audio0 = new Audio(pomodoroSound)
  const audio1 = new Audio(breakSound)
  audio0.volume = 0.3
  audio1.volume = 0.3

  const handleTimerReset = () => {
    window.clearInterval(refTimer.current)
      refTimer.current=null
      setIsRunning(false)
      setSeconds(countDownTime)
    }
    
  React.useEffect(() => {

    if(selectedTimer === id) {
      document.title = formatTime(seconds);
    } else {
      handleTimerReset()
    }

    if(seconds===0) {
      handleTimerReset()
      if(selectedTimer==="pomodoro"){
        audio0.play()
        setPomodorosCompleted(pomodorosCompleted + 1)

        if(checkIfEvery4th===0) {
          console.log('4th one fired')
          setSelectedTimer("long break")
        } else {
          setSelectedTimer("short break")
        }

      } else {
        audio1.play()
        setSelectedTimer(0)
      }
    }
  }, [seconds, selectedTimer])

  const handleStartTimer = () => {
    if(isRunning===false) {
      const nextSession = checkNextSession()
      const endsIn = checkEndTime(seconds)
      setNextUp({
        title: nextSession,
        time: endsIn,
      })
      refTimer.current = window.setInterval(()=> {
        setSeconds((s)=> s - 1)
      }, 1000)
      setIsRunning(true)
    } else {
      window.clearInterval(refTimer.current)
      refTimer.current=null
      setIsRunning(false)
    }
    buttonClickAudio.play()
  }
  
  if(!isSelected) return null

  //ADD the upcoming phase. "Next: Short Break @10:28AM 🍵" When paused it goes away, then press start it appears

  //create a handleSkip button, moves selectedTimer forward and adds pomodoro progress
  return (
    <div className="flex flex-col items-center">
        <p className="mt-8 text-zinc-400 font-medium text-small">SESSION #{((selectedTimer==="short break" || selectedTimer==="long break")&& pomodorosCompleted>0)? pomodorosCompleted: pomodorosCompleted + 1}</p>
        <h1 className="font-medium" style={{fontSize:"120px"}}>{formatTime(seconds)}</h1>
        <Button size="lg" style={{width:"256px"}} color="primary" onClick={handleStartTimer}>{isRunning ? "Pause" : "Start"}</Button>
    </div>
  );
}

export default Timer;
