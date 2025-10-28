import { FaRegEdit, FaCheck, FaTrashAlt } from "react-icons/fa";


const Task = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
  return (
    <div className={task.completed ? "task completed" : "task not-completed"}>
      <p>
        <b>{index + 1}.</b>
        {task.name}
      </p>
      <div className="task-icons">
        <FaCheck color="green" onClick={() => {
          setToComplete(task)
        }} />
        <FaRegEdit color="purple" onClick={() => {
          getSingleTask(task)
        }
        } />
        <FaTrashAlt color="red" onClick={() => {
          deleteTask(task._id)
        }} />
      </div>
    </div>
  )
}

export default Task;