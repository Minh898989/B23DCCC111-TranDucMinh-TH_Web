import { useState, useEffect } from "react";
import { Button, Input, DatePicker, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import "./styles.css";
import { Task } from "@/services/TodoList/typings";

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask,
        date: selectedDate,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id: number, newText: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  return (
    <div className="todo-container">
      <h1 className="title">To-Do List</h1>
      <div className="task-input">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
          className="task-input-field"
        />
        <DatePicker
          value={moment(selectedDate)}
          onChange={(date) => setSelectedDate(date ? date.format("YYYY-MM-DD") : "")}
          className="date-picker"
        />
        <Button type="primary" onClick={addTask} className="add-button">Add Task</Button>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <Card key={task.id} className="task-card">
            <div className="task-content">
              <p className="task-text">{task.text}</p>
              <p className="task-date">Due: {task.date}</p>
            </div>
            <div className="task-actions">
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  const newText = prompt("Edit task:", task.text);
                  if (newText) editTask(task.id, newText);
                }}
                className="edit-button"
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => deleteTask(task.id)}
                className="delete-button"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
