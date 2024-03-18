// TaskApp.js
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import TaskForm from './TaskForm';
import '../App.css';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA6bKAjCTKq93bi0y84JVJ0lQ1blEGaaGE",
    authDomain: "pestodemo.firebaseapp.com",
    projectId: "pestodemo",
    storageBucket: "pestodemo.appspot.com",
    messagingSenderId: "8270694355",
    appId: "1:8270694355:web:b34148666f5162028f1126",
    measurementId: "G-W3J0FEX3N0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showTaskFormModal, setShowTaskFormModal] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection('tasks').onSnapshot(snapshot => {
      const fetchedTasks = [];
      snapshot.forEach(doc => {
        fetchedTasks.push({ id: doc.id, ...doc.data() });
      });
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateTask = async (newTask) => {
    try {
      await db.collection('tasks').add(newTask);
      setShowTaskFormModal(false); // Close the modal after task creation
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    try {
      await db.collection('tasks').doc(taskId).update({
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await db.collection('tasks').doc(taskId).delete();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const filteredTasks = filterStatus === 'All' ? tasks : tasks.filter(task => task.status === filterStatus);

  return (
    <>
    <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Task Management</a>
          <form className="d-flex">
            <button type="button" className="btn btn-primary" onClick={() => setShowTaskFormModal(true)}>Create Task</button>
          </form>
        </div>
      </nav>
    <div className="container mt-5">
      
      <div className="modal" style={{ display: showTaskFormModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Task</h5>
              <button type="button" className="btn-close" onClick={() => setShowTaskFormModal(false)}></button>
            </div>
            <div className="modal-body">
              <TaskForm onCreateTask={handleCreateTask} />
            </div>
          </div>
        </div>
      </div>
      <div className="task-filter">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select  id="status-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="task-list mt-3">
        <h5 className='mb-3'>Tasks:</h5>
        {filteredTasks.map(task => (
          <div key={task.id} className="task-item shadow border-0 p-3 mb-5 bg-body rounded-3">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <div className="task-buttons">
              {task.status !== 'In Progress' && (
                <button className='btn btn-success' onClick={() => handleUpdateTask(task.id, 'In Progress')}>Start</button>
              )}
              {task.status !== 'Done' && (
                <button className='btn btn-warning' onClick={() => handleUpdateTask(task.id, 'Done')}>Finish</button>
              )}
              <button className='btn btn-danger' onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default TaskApp;


