import * as React from 'react'
import Timer from './Timer'
import {Card, CardBody, Tabs, Tab, Button, Tooltip} from "@nextui-org/react";
import matcha from './media/matcha.svg'
import lightning from './media/lightning.svg'
import TimerContext from './TimerContext'
import FastForward from './media/FastForward'

function Pomodoro({addEventToCal, googleCalAvailable}) {
    const {timerTypes, selectedTimer, setSelectedTimer, isRunning, nextUp, pomodorosCompleted, setPomodorosCompleted, tasks, handleUpdate, selectedTask, events, handleAddEvent, handleEventsUpdate, addEvent} = React.useContext(TimerContext)
    const [eventTimeTracker, setEventTimeTracker] = React.useState({
        timerType: selectedTimer,
        timeStart: '',
        hasPaused: false,
    })

    const handleSkip = () => {
        setSelectedTimer(nextUp.id)
        if(selectedTimer===timerTypes[0].id) {
            setPomodorosCompleted(pomodorosCompleted + 1)
            localStorage.setItem("pomodorosCompleted", (pomodorosCompleted + 1))

            //if there's a task selected, make a shallow copy of that task's pomodoro object
            let updatedPomodoros = {}
            tasks.map((task) => {
              if(task.id === selectedTask.id) {
                updatedPomodoros = task.pomodoros
              }
            })

            //if there's a task selected, then increments completed pomodoros to 1 for that task
            //TODO: include conditional here. only if the task has 1 or more total pomodoros, then you add
            const updatedTasks = handleUpdate(selectedTask.id, {pomodoros: {
              ...updatedPomodoros,
              completed: updatedPomodoros.completed + 1,
            }})
            localStorage.setItem("tasks", JSON.stringify(updatedTasks))    
        }

        //handle adding an event here and pushing to local storage. If google cal is authenticated, then push to google calendar
        const now = new Date()
        const startT = eventTimeTracker.timeStart
        const endT = now 
        const durationMins = Math.floor((endT - startT) / 60000)
        const newEvent = {
            id: now,
            timerType: selectedTimer,
            timeStart: eventTimeTracker.timeStart,
            timeEnd: endT, 
            duration: durationMins,
        }
        handleAddEvent(newEvent)

        if(selectedTimer === "pomodoro" && googleCalAvailable) {
            addEventToCal("Focus Time", startT, endT, durationMins, selectedTask)
        }
        
    }

    //reason why I can't put the buttons inside a ternary operator is because there's going to be an error when trying to reference and add event listener since it's not loaded on the dom yet
    return (
    <div className="flex flex-col gap-0 items-center pt-12">
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
                return <Timer eventTimeTracker={eventTimeTracker} setEventTimeTracker= {setEventTimeTracker} key={timer.id} id={timer.id} favicon={timer.favicon} countDownTime={timer.countDownTime} addEventToCal={addEventToCal} googleCalAvailable={googleCalAvailable} />
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
                {`${nextUp.title} at`}  
                <b>&nbsp;{nextUp.time}</b>
                {selectedTimer==="pomodoro" ? <img className="h-6" src={matcha} /> : <img className="h-6" src={lightning} />}
                <div className="absolute right-4 bottom-3">
                <Button isIconOnly size="sm" color="none" className="hover:bg-gray-300" onClick={handleSkip}>
                    <FastForward />
                </Button>
                </div>
            </CardBody>
        </Card>}
    </div>

    );
}

export default Pomodoro;
