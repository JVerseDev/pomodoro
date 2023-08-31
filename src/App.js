import * as React from 'react'
import {NextUIProvider} from "@nextui-org/react";
import TimerContext from './TimerContext'
import Intro from './Intro'
import Pomodoro from './Pomodoro';
import Tasks from './Tasks'
import Main from './Main';
import matcha from './media/matcha.svg'
import lightning from './media/lightning.svg'
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
  //timer
  const [selectedTimer, setSelectedTimer] = React.useState("pomodoro")
  const [pomodorosCompleted, setPomodorosCompleted] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [nextUp, setNextUp] = React.useState({
    id: "",
    title: "",
    time: 0,
  })
  const checkIfEvery4th = (pomodorosCompleted + 1) % 4
  //tasks
  const [tasks, setTasks] = React.useState([])
  const [selectedTask, setSelectedTask] = React.useState({
    id: '',
    title: '',
    pomodoros: {
      completed: 0,
      total: 0,
    }
  })
  //events tracker
  const [events, setEvents] = React.useState([])



  React.useEffect(() => {
    //gets # of saved pomodoros 
    const savedPomodoros = localStorage.getItem("pomodorosCompleted")
    const parsedSavedPomodoros = JSON.parse(savedPomodoros)
    if(savedPomodoros) {
      setPomodorosCompleted(parsedSavedPomodoros)
    }

    //gets saved tasks
    const savedTasks = localStorage.getItem("tasks")
    const parsedSavedTasks = JSON.parse(savedTasks)
    if(parsedSavedTasks) {
      setTasks(parsedSavedTasks)
    }

    //gets saved events
    const savedEvents = localStorage.getItem("events")
    const parsedSavedEvents = JSON.parse(savedEvents)
    if(parsedSavedEvents) {
      setEvents(parsedSavedEvents)
    }
  }, [])


  //events tracker
  const handleEventsUpdate = (id, updatedEvent) => {
    const updatedEvents = tasks.map((item) => {
        return item.id===id ? {...item, ...updatedEvent} : item
    })
    setEvents(updatedEvents)
    return updatedEvents
  }

  //this should only be invoked after time ends or user skips. but there needs to be an external state that keeps track of when start was clicked
  const handleAddEvent = (event) => {
    const newEvents = [
        ...events,
        event
    ]
    setEvents(newEvents)
    localStorage.setItem("events", JSON.stringify(newEvents))

}

const handleDeleteEvent = (id) => {
    const newEvents = events.filter((item) => 
        id !== item.id
    )
    setEvents(newEvents)
    //localStorage.setItem("tasks", JSON.stringify(newTasks))
}


  console.log(selectedTask)

  //checks next session when user clicks on start 
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
  

  //handle update for tasks
  const handleUpdate = (id, updatedItem) => {
    const updatedTasks = tasks.map((item) => {
        return item.id===id ? {...item, ...updatedItem} : item
    })
    setTasks(updatedTasks)
    return updatedTasks
}



  return (
    <NextUIProvider>
      <TimerContext.Provider value={{
        timerTypes,
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
        tasks,
        setTasks,
        selectedTask,
        setSelectedTask,
        handleUpdate,
        events,
        handleAddEvent,
        handleEventsUpdate
        }}>
        <div className="h-screen">
          <Main pomodoroEvents={events} />
        </div>
      </TimerContext.Provider>
    </NextUIProvider>
  );
}

export default App;
