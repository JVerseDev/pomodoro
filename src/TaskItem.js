import * as React from 'react'
import {Card, CardBody, Button, Progress, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Checkbox, Input, Textarea} from "@nextui-org/react";
import Elipses from './media/Elipses'
import { checkDueDate, getTodaysDate } from './utils';
import TimerContext from './TimerContext';



function TaskItem({task, isNew, id, title, notes, isComplete, pomodoros, dueDate, selectedTask, setSelectedTask, handleUpdate, handleDelete}) {
    const {tasks} = React.useContext(TimerContext)
    const [isEditing, setisEditing] = React.useState(false)
    const [currentTask, setCurrentTask] = React.useState({
        id: id,
        title: title,
        notes: notes,
        isNew: false,
        isComplete: isComplete,
        pomodoros: {
            completed: pomodoros.completed,
            total: pomodoros.total
        },
        dueDate: dueDate
    })

    React.useEffect(() => {
        if(isNew) {
            setisEditing(true)
        }
        setCurrentTask(task)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        const savedTasks = localStorage.getItem("tasks")
        const parsedSavedTasks = JSON.parse(savedTasks)
    }, [isEditing])

    const handleTitleChange = (e) => {
       handleUpdate(id, {title: e.target.value})
    }

    const handleGoalChange = (e) => {
        handleUpdate(id, {notes: e.target.value})
     }

     const handlePomodoroNumChange = (e) => {
        handleUpdate(id, {pomodoros: {
            completed: pomodoros.completed,
            total: parseInt(e.target.value)
        }})
     }

     const handleHasDueDate = () => {
        const timeRemaining = checkDueDate(getTodaysDate())
        handleUpdate(id, {dueDate:{
            hasDueDate: !dueDate.hasDueDate,
            ...timeRemaining,
        }})
     }

     const handleDueDateChange = (e) => {
        const timeRemaining = checkDueDate(e.target.value)
        handleUpdate(id, {dueDate:{
            ...dueDate,
            ...timeRemaining
        }})
     }

     const dueDateLabel = () => {
        if(dueDate.daysLeft === 0) {
            return "Due Today"
        } else if (dueDate.daysLeft === 1) {
            return "Due Tomorrow" 
        } else if (dueDate.daysLeft > 1) {
            return `${dueDate.daysLeft} Days Left`
        } else {
            return "Overdue"
        }
     }

     const handleSave = () => {
        setisEditing(false)
        handleUpdate(id, {isNew: false})
     }

     //When you create a new task (adding it to localStorage) and then press cancel, it doesn't remove the new blank task. When you refresh, it's still there in edit mode. 
     const handleReset = () => {
        if(isNew){
            handleDelete(id)
        } else {
            handleUpdate(id, currentTask)
        }
        setisEditing(false)
        console.log(isEditing)
     }

     const handleSelectedTask = () => {
        setSelectedTask({id, pomodoros})
     }

   
    //put line clamps here later for notes and title
    //Create a smaller list item for the ones not in focus. 
    return (
    <div className="mt-4">
        {isEditing===true
            ? <Card
            shadow="none"
        >
            <CardBody
            >
                <div className="flex flex-col justify-between-4">
                    <Input
                        isRequired
                        autoFocus
                        label="Title"
                        placeholder="Enter the title of your task"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <Textarea
                        label="Goal"
                        labelPlacement="inside"
                        placeholder="Write down what you want to achieve in these sessions."
                        className="max-w mt-3"
                        value={notes}
                        onChange={handleGoalChange}
                    />
                    <Input
                        type="number"
                        label="Pomodoros"
                        placeholder="0"
                        min="0"
                        className='mt-2'
                        labelPlacement="inside"a
                        value={pomodoros.total}
                        onChange={handlePomodoroNumChange}
                        startContent={
                            <div className="pointer-events-none flex items-center">
                            </div>
                        }
                    />
                    <div className="flex flex-col justify-between">
                        <Checkbox
                            classNames={{
                            label: "text-small",
                            }}
                            className="mt-3"
                            isSelected={dueDate.hasDueDate}
                            onValueChange={handleHasDueDate}
                        >
                            Due Date
                        </Checkbox>
                        {dueDate.hasDueDate && 
                        <Input
                            type="date"
                            label="Due Date"
                            className="mt-3"
                            placeholder="Enter the title of your task"
                            onChange={handleDueDateChange}
                            value={dueDate.date}
                        />}
                        
                    </div>
                </div>
                <Button isDisabled={title ? false : true} color="primary" className="mt-4" onPress={handleSave}> 
                        Save
                </Button>
                <Button color="primary" variant="light" className="mt-2" onPress={handleReset}> 
                        Cancel
                </Button>
            </CardBody>
        </Card>
            : 

        <div onClick={handleSelectedTask} >
            <Card
                shadow="none"
                className='hover:bg-slate-200 active:bg-slate-300 cursor-pointer'
            >
                {selectedTask.id === id && <div className='absolute bg-slate-700 w-2 h-full'></div>}
                <CardBody
                >
                    <div className="flex flex-col relative">
                        <h1 className="text-medium font-medium pr-10">{title}</h1>
                        <p className="text-small text-foreground/80 text-default-500 pr-10">{notes}</p>
                        {pomodoros.total > 0 && 
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <p className="text-small text-foreground/80 text-default-400"><b>{pomodoros.completed}</b> of {pomodoros.total} Pomodoros</p>
                                {dueDate.hasDueDate && <p className="text-small text-foreground/80 text-default-500">{dueDateLabel()}</p>}
                            </div>
                            <Progress className="mt-2" size="sm" aria-label="Pomodoro progress" value={(pomodoros.completed / pomodoros.total) * 100} />
                        </div>}
                        {(pomodoros.total === 0 && dueDate.hasDueDate) && <p className="text-small text-foreground/80 text-default-500">{dueDateLabel()}</p>}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size='sm' color="none" className="absolute right-0 top-0 hover:bg-gray-300">
                                    <Elipses />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem key="edit" onClick={() => setisEditing(true)}>Edit</DropdownItem>
                                <DropdownItem key="done">Mark as done</DropdownItem>
                                <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => handleDelete(id)}>
                                Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </CardBody>
            </Card>
        </div>
        }
    </div>

    );
}

export default TaskItem;
