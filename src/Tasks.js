import * as React from 'react'
import TaskItem from './TaskItem'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Input, Link, Textarea } from '@nextui-org/react'
import Plus from './media/Plus'
import TimerContext from './TimerContext'

function Tasks() {
    const {tasks, setTasks, selectedTask, setSelectedTask, handleUpdate} = React.useContext(TimerContext)

    //does this belong here or just when you save it? OHH wait this might be resetting everytime you re-render the page. Since initial tasks are set to nothing. 

    const handleAdd = () => {
        setTasks([
            ...tasks,
            {
                id: new Date(),
                isNew: true, 
                title: "",
                notes: "",
                isComplete: false,
                pomodoros: {
                    completed: 0,
                    total: 0,
                },
                dueDate: {
                    hasDueDate: false,
                    date: '',
                    daysLeft: '',
                    hoursLeft: '',
                }
            }
        ])
    }

    const handleDelete = (id) => {
        const newTasks = tasks.filter((item) => 
            id !== item.id
        )
        setTasks(newTasks)
        localStorage.setItem("tasks", JSON.stringify(newTasks))
    }
   
    return (
    <div className="flex flex-col m-auto py-12 w-[512px]">
        <div className="flex justify-between mb-4">
            <div>
                <h1 className="text-large font-semibold text-foreground/90">Tasks</h1>
            </div>
        </div>
        {tasks.map((item) => 
            <TaskItem key={item.id} task={item} isNew={item.isNew} id={item.id} title={item.title} notes={item.notes} dueDate={item.dueDate} isComplete={item.isComplete} pomodoros={item.pomodoros} selectedTask={selectedTask} setSelectedTask={setSelectedTask} handleUpdate={handleUpdate} handleDelete={handleDelete}/>
        )}
        <Button
              className="mt-4"
              endContent={<Plus />}
              size="md"
              variant="ghost"
              onPress={handleAdd}
            >
              Add New
        </Button>
    </div>

    );
}

export default Tasks;
