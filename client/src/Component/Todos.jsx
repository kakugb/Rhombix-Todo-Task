import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
function Todos() {
    const [task, setTask] = useState('');
    const [list, setList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
  
    useEffect(() => {
      fetchTodos();
    }, []);
  
    const fetchTodos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/todos/getAll');
        setList(res.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    const addTodoList = async () => {
      if (task.trim() === '') {
        alert('Task cannot be empty');
        return;
      }
  
      if (isEditing) {
        try {
         
          await axios.put(`http://localhost:5000/api/todos/update/${editId}`, { task });
          setIsEditing(false);
          setEditId(null);
          toast.info("Task updated successfully!");
        
        } catch (error) {
          console.error('Error updating todo:', error);
        }
      } else {
        try {
          const res = await axios.post('http://localhost:5000/api/todos/add', { task });
          setList([...list, res.data]);
          toast.success("Success! Add task in todo list.");
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
  
      setTask('');
      fetchTodos(); 
    };
    
    const deleteTodo = async (id) => {
      
      try {
        await axios.delete(`http://localhost:5000/api/todos/delete/${id}`);
        fetchTodos(); 
        toast.error("Task deleted successfully !");
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };
  
    
    const editTodo = (id, task) => {
      
      setTask(task);
      setIsEditing(true);
      setEditId(id);
    };
  
    
   
  return (
    
    <div class="max-w-md mx-auto py-8">
    <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white bg-sky-600 p-2 rounded-lg">To-Do App </h1>
    </header>

    <div class="bg-gray-300 rounded-lg shadow-md p-6">
        <div class="flex items-center mb-4">
            <input
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Add a new task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                />
            <button class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
             onClick={addTodoList}
            > {isEditing ? 'Update' : 'Add'}</button>
        </div>

        <ul class="divide-y divide-gray-200">
        {
        list.map((value) => (
            <li key={value._id} class="max-w-md py-3 flex items-center justify-between bg-blue-300 px-3 rounded-md mb-2  text-xl font-semibold">
                <div class="flex items-center">
                    <span>{value.task}</span>
                </div>
                <div>
                <button class="max-w-max text-white hover:text-red-600 hover:font-bold py-1 px-3 "
                onClick={() => deleteTodo(value._id)}
                ><FontAwesomeIcon icon={faTrash} className="mr-2 text-xl" /></button>
                <button class="max-w-max text-white hover:text-blue-600 hover:font-bold py-1 px-3"
                onClick={() => editTodo(value._id, value.task)}
                ><FontAwesomeIcon icon={faPen} className="mr-2 text-xl" /></button>
                </div>
            </li>
        ))
        }

        </ul>
    </div>
    <ToastContainer />
    </div>
  )
}

export default Todos