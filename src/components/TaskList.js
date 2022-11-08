import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Task from './Task'
import TaskForm from './TaskForm'
import axios from "axios"
import { URL } from '../App'
import loadingImg from "../assets/loader.gif"

//http://localhost:5000/api/tasks

const TaskList = () => {
    const [tasks, setTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [isLoadding, setIsLoadding] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [taskID, setTaskID] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        completed: false
    })
    const {name} = formData

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const getTasks = async () => {
        setIsLoadding(true)
        try {
            const {data} = await axios.get(`${URL}/api/tasks`)
            setTasks(data)
            setIsLoadding(false)
        }catch(error){
            toast.error(error.message)
            setIsLoadding(false)
        }
    }

    useEffect(() => {
        getTasks()
    }, [])

    const createTask = async (e) => {
        e.preventDefault()
        if (name === "") {
            return toast.error("Input field cannot be empty")
        }
        try {
            await axios.post(`${URL}/api/tasks`, formData)
            toast.success("Task added succesfully")
            setFormData({...formData, name: ""})
            getTasks()
        }catch(error){
            toast.error(error.message)
        }
    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`)
            getTasks()
        }catch(error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const cTask = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(cTask)
    }, [tasks])

    const getSingleTask = async(task) => {
        setFormData({name: task.name, completed: false})
        setTaskID(task._id)
        setIsEditing(true)
    }

    const updateTask = async (e) => {
        e.preventDefault()
        if (name === ""){
            return toast.error("Input field cannot be empty.")
        }
        try {
            await axios.put(`${URL}/api/tasks/${taskID}`, formData)
            setFormData({...formData, name: ""})
            setIsEditing(false)
            getTasks()
        }catch(error){
            toast.error(error.message)
        }
    }

    const setToComplete = async (task) => {
        const newFormData = {
            name: task.name,
            completed: true,
        }
        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
            getTasks()
        }catch(error){
            toast.error(error.message)
        }
    }

  return (
    <div>
        <h2>Task Manager</h2>    
        <TaskForm name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask}/>
        {tasks.length > 0 && (
            <div className='--flex-between --pb'>
            <p>
                <b>Total Tasks:</b> {tasks.length}
            </p>
            <p>
                <b>Completed Tasks:</b> {completedTasks.length}
            </p>
        </div>
        )}

        <hr />
        {
            isLoadding && (
                <div className="--flex-center">
                    <img src={loadingImg} alt="Loading" />
                </div>
            )
        }
        {
            !isLoadding && tasks.length === 0 ? (
                <p className='--py'>No task added. Please add a task.</p>
            ) : (
                <>
                {tasks.map((task, index) => {
                    return(
                        <Task key={task._id} task={task} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete}/>
                    )
                })}
                </>
            )}
        
    </div>
  )
}

export default TaskList