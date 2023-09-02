import * as React from 'react'
import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from '@nextui-org/react';
import { getTodaysDate, getTime } from './utils';
import TimerContext from './TimerContext'
import Down from './media/Down';


const greetings = {
    morning: {
        intro: "Good Morning",
        emoji: '🌇'
    },
    afternoon: {
        intro: "Good Afternoon",
        emoji: '☀️'
    },
    evening: {
        intro: "Good Evening",
        emoji: '🌌'
    }
}


function Intro( {pomodorosCompleted} ) {

    const {getFocusEvents, todaysEvents} = React.useContext(TimerContext)

    const timeOfDay = () => {
        const currentHour = getTime()
        if (currentHour >= 5 && currentHour < 12) {
            return <span>{greetings.morning.intro} {greetings.morning.emoji}</span>
        } else if (currentHour >= 12 && currentHour < 19) {
            return <span>{greetings.afternoon.intro} {greetings.afternoon.emoji}</span>
        } else {
            return <span>{greetings.evening.intro} {greetings.evening.emoji}</span>
        }
    }

    const [selectedOption, setSelectedOption] = React.useState(new Set(["merge"]));
  
    // Convert the Set to an Array and get the first value.
    const selectedOptionValue = Array.from(selectedOption)[0];

    const getTotalFocusDuration = () => {
        let sumInMins = 0
        if(todaysEvents){
            getFocusEvents(todaysEvents).map((event) => sumInMins += event.duration)
            const hour = Math.floor(sumInMins / 60)
            const mins = sumInMins % 60
            const displayHours = `${hour} ${hour>1 ? ' hours' : ' hour'} ${Math.floor(mins)} ${sumInMins>1 ? ' mins' : ' min'}`
            const displayMins = `${Math.floor(sumInMins)} ${sumInMins>1 ? ' mins' : ' min'}`
            return (sumInMins < 60 ? displayMins : displayHours)
        }

        return ''
    }


    return (
        <div className="flex flex-col items-center">
            <p className='mt-8'>{getTodaysDate().todaysDate}</p>
            <h1 className="text-3xl mt-2">{timeOfDay()}</h1>

            <ButtonGroup className="mt-4" radius="full">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                    <Button 
                        className='bg-[#E4E4E7]'
                        endContent={
                            <div className="pointer-events-none flex items-center">
                              <Down />
                            </div>
                          }
                    >
                        Today
                    </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Merge options"
                        selectedKeys={selectedOption}
                        selectionMode="single"
                        onSelectionChange={setSelectedOption}
                        className="max-w-[300px]"
                        >
                        <DropdownItem key="merge" description="today">
                            Today
                        </DropdownItem>
                   
                    </DropdownMenu>
                </Dropdown>
                <Tooltip content={`Total Focus Time: ${getTotalFocusDuration()}`}>
                    <Button className='bg-[#E4E4E7]'>Focus Sessions <b>{getFocusEvents(todaysEvents).length}</b> </Button>
                </Tooltip>
                <Button className='bg-[#E4E4E7]'> Tasks Completed <b>0</b></Button>
            </ButtonGroup>
        </div>

    );
}

export default Intro;
