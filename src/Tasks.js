import * as React from 'react'
import TaskItem from './TaskItem'

function Tasks() {
    const [tasks, setTasks] = React.useState([])
   
    return (
    <div className="flex justify-center py-12">
        <TaskItem />
    </div>

    );
}

export default Tasks;
