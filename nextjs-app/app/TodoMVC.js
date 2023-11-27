"use client";
import { useState } from "react";

export default function TodoMVC() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const addTask = () => {
        if (newTask.trim()) {
            // Ensure that empty or whitespace-only tasks are not added
            setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]);
            setNewTask("");
        }
    };

    const toggleTaskCompletion = (id) => {
        setTasks(
            tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
        );
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    };

    return (
        <div>
            <h1>ToDoMVC</h1>

            <div>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new task"
                />
                <button onClick={addTask}>Add</button>
            </div>

            <ul>
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        style={{ textDecoration: task.completed ? "line-through" : "none" }}
                    >
                        {task.text}
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                        />
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
