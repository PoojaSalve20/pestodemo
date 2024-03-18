// TaskForm.js
import React, { useState } from 'react';
import '../App.css';

const TaskForm = ({ onCreateTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleCreateTask = () => {
    onCreateTask({
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'To Do'
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Task Title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <button onClick={handleCreateTask}>Add Task</button>
    </div>
  );
};

export default TaskForm;
