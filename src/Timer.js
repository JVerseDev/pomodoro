import * as React from 'react'
import TimerContext from './TimerContext'
import sound from './media/UIclick.mp3'
import pomodoroSound from './media/Ping1.mp3'
import breakSound from './media/Softchime.mp3'
import {Button, CardBody, Tooltip, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import { formatTime } from './utils'

function Timer( {id, countDownTime, favicon, eventTimeTracker, setEventTimeTracker, addEventToCal, googleCalAvailable} ) {
  const [seconds, setSeconds] = React.useState(countDownTime)
  const {selectedTimer, setSelectedTimer, pomodorosCompleted, setPomodorosCompleted, isRunning, setIsRunning, setNextUp, checkIfEvery4th, checkNextSession, checkEndTime, tasks, handleUpdate, selectedTask, events, handleAddEvent, handleEventsUpdate} = React.useContext(TimerContext)
  const isSelected = selectedTimer === id
  const refTimer = React.useRef(null)
  //for modal reset
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  //is there a way to clean this up?
  const buttonClickAudio = new Audio(sound)
  const audio0 = new Audio(pomodoroSound)
  const audio1 = new Audio(breakSound)
  audio0.volume = 0.3
  audio1.volume = 0.3

  React.useEffect(() => {

    if(selectedTimer === id) {
      document.title = formatTime(seconds);
    } else {
      handleTimerReset()
      setEventTimeTracker({
        timerType: selectedTimer,
        timeStart: '',
        hasPaused: false,
        timeEnd: ''
      })
    }

    if(seconds===0) {
      handleTimerReset()

      //handle adding an event here and pushing to local storage.
      const now = new Date()
      const startT = eventTimeTracker.timeStart
      const endT = now 
      const durationMins = Math.round((endT - startT) / 60000)
      const newEvent = {
          id: now,
          timerType: selectedTimer,
          timeStart: eventTimeTracker.timeStart,
          timeEnd: endT, 
          duration: durationMins,
      }
      handleAddEvent(newEvent)

      console.log(googleCalAvailable)

      if(googleCalAvailable) {
        console.log('fired')
        addEventToCal(selectedTimer, startT, endT, durationMins, selectedTask)
      }

      if(selectedTimer==="pomodoro"){
        audio0.play()
        setPomodorosCompleted(pomodorosCompleted + 1)

        //handles the task selected, incrememnts completed pomodoros to 1
        let updatedPomodoros = {}
        tasks.map((task) => {
          if(task.id === selectedTask.id) {
            updatedPomodoros = task.pomodoros
          }
        })
        const updatedTasks = handleUpdate(selectedTask.id, {pomodoros: {
          ...updatedPomodoros,
          completed: updatedPomodoros.completed + 1,
        }})

        localStorage.setItem("tasks", JSON.stringify(updatedTasks))
        localStorage.setItem("pomodorosCompleted", JSON.stringify(updatedPomodoros.completed + 1))

        if(checkIfEvery4th===0) {
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
        id: nextSession.id,
        title: nextSession.title,
        time: endsIn,
      })

      //timer countdown
      refTimer.current = window.setInterval(()=> {
        setSeconds((s)=> s - 1)
      }, 1000)
      setIsRunning(true)

      //eventTimeTracker - tracks when user started timer
      if(eventTimeTracker.hasPaused === false) {
        const now = new Date()
        setEventTimeTracker({
          ...eventTimeTracker,
          timerType: selectedTimer,
          timeStart: now,
          hasPaused: false,
        })
      }
  
    } else {
      window.clearInterval(refTimer.current)
      refTimer.current=null
      setIsRunning(false)
      setEventTimeTracker({
        ...eventTimeTracker,
        hasPaused: true,
      })
    }
    buttonClickAudio.play()
  }

  const handleTimerReset = () => {
    window.clearInterval(refTimer.current)
      refTimer.current=null
      setIsRunning(false)
      setSeconds(countDownTime)
    }
  

  const handleSessionReset = () => {
    setPomodorosCompleted(0)
    localStorage.setItem("pomodorosCompleted", 0)
  }


  
  if(!isSelected) return null

  //Create a functionality for auto start?
  return (
    <div className="flex flex-col items-center">
        <Tooltip content="Reset Sessions">
          <p onClick={onOpen} className="mt-8 text-zinc-400 font-medium text-small cursor-pointer">SESSION #{((selectedTimer==="short break" || selectedTimer==="long break")&& pomodorosCompleted>0)? pomodorosCompleted: pomodorosCompleted + 1}</p>
        </Tooltip>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Do You Want to Reset Sessions?</ModalHeader>
              <ModalBody>
                <p> 
                Resetting the session count will set the number of sessions back to one. Are you sure you want to reset?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {
                  handleSessionReset()
                  onClose()
                }}>
                  Reset
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        <h1 className="font-medium" style={{fontSize:"120px"}}>{formatTime(seconds)}</h1>
        <Button size="lg" style={{width:"256px"}} color="primary" onClick={handleStartTimer}>{isRunning ? "Pause" : "Start"}</Button>
    </div>
  );
}

export default Timer;
