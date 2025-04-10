import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [confetti, setConfetti] = useState(false);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        justCompleted: false
      }
    ]);

    setNewTodo('');
  };

  const handleToggleTodo = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const wasCompleted = todo.completed;
        return {
          ...todo,
          completed: !todo.completed,
          justCompleted: !wasCompleted
        };
      }
      return { ...todo, justCompleted: false };
    });

    setTodos(updatedTodos);
  };

  useEffect(() => {
    const justCompletedTodo = todos.find((todo) => todo.justCompleted);
    if (justCompletedTodo) {
      setConfetti(true);
      const timer = setTimeout(() => {
        setConfetti(false);
        setTodos((prev) =>
          prev.map((todo) => ({ ...todo, justCompleted: false }))
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [todos]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {confetti && <Confetti />}
      <h1>Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          style={{
            padding: '10px',
            width: '250px',
            fontSize: '16px',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '2rem' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => handleToggleTodo(todo.id)}
            style={{
              cursor: 'pointer',
              textDecoration: todo.completed ? 'line-through' : 'none',
              padding: '10px',
              backgroundColor: todo.completed ? '#c8f7c5' : '#f4f4f4',
              margin: '10px auto',
              width: '300px',
              borderRadius: '5px',
              fontSize: '18px'
            }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;