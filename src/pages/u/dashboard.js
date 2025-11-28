import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    function fetchTodos () {
        axios.get('/api/todos').then(res => {
            setTodos(res.data);
        }).catch((error) => {});
    }

    useEffect(() => {
        fetchTodos();
    }, []);

    function addTodo(e) {
        e.preventDefault();
        if (!newTodo.trim()) return;
        axios.post('/api/todos', { text: newTodo })
            .then(() => {
                fetchTodos()
                setNewTodo('');
            });
    };

    function deleteTodo(id){
        axios.delete(`/api/todos/${id}`)
            .then(() => fetchTodos());
    };

    function startEdit(todo){
        setEditId(todo.id);
        setEditText(todo.text);
    };

    function updateTodo(e){
        e.preventDefault();
        if (!editText.trim()) return;
        axios.put(`/api/todos/${editId}`, { text: editText })
            .then(() => {
                setEditId(null);
                setEditText('');
                fetchTodos();
            });
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Todos</h2>
            <form onSubmit={addTodo} className="flex mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
                    placeholder="Add new todo"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">Add</button>
            </form>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} className="flex items-center justify-between mb-2">
                        {editId === todo.id ? (
                            <form onSubmit={updateTodo} className="flex w-full">
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                    className="flex-1 px-2 py-1 border rounded-l"
                                />
                                <button className="bg-green-600 text-white px-3 py-1 rounded-r hover:bg-green-700">Save</button>
                            </form>
                        ) : (
                            <>
                                <span>({todo.id}) {todo.text}</span>
                                <div>
                                    <button
                                        onClick={() => startEdit(todo)}
                                        className="text-blue-600 mr-2 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;