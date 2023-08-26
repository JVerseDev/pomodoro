import * as React from 'react'
import Timer from './Timer'
import {Card, CardBody, Tabs, Tab, Button, Tooltip} from "@nextui-org/react";
import matcha from './media/matcha.svg'
import lightning from './media/lightning.svg'
import TimerContext from './TimerContext'
import FastForward from './media/FastForward'

function Pomodoro({timerTypes}) {
    const {selectedTimer, setSelectedTimer, isRunning, nextUp, pomodorosCompleted, setPomodorosCompleted} = React.useContext(TimerContext)

    const handleSkip = () => {
        setSelectedTimer(nextUp.id)
        selectedTimer===timerTypes[0].id && setPomodorosCompleted(pomodorosCompleted + 1)
    }

    return (
    <div className="flex flex-col gap-0 items-center pt-24">
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
