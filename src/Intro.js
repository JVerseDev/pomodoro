import * as React from 'react'
import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { getTodaysDate, getTime } from './utils';


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

    return (
        <div className="flex flex-col items-center">
            <p className='mt-8'>{getTodaysDate()}</p>
            <h1 className="text-3xl mt-2">{timeOfDay()}</h1>

            <ButtonGroup className="mt-4" radius="full">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                    <Button className='bg-[#E4E4E7]'>
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
                    <Button className='bg-[#E4E4E7]'>Focus Sessions <b>{pomodorosCompleted}</b> </Button>
                    <Button className='bg-[#E4E4E7]'> Tasks Completed</Button>
            </ButtonGroup>
        </div>

    );
}

export default Intro;
