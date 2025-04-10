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
        justCompleted: false // prevent confetti when adding
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
          justCompleted: !wasCompleted // only true if it's now marked complete
        };
      }
      return { ...todo, justCompleted: false }; // reset others
    });

    setTodos(updatedTodos);
  };

  useEffect(() => {
    const justCompletedTodo = todos.find((todo) => todo.justCompleted);
    if (justCompletedTodo) {
      setConfetti(true);
      const timer = setTimeout(() => {
        setConfetti(false);
        // reset justCompleted after confetti
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
          style={{ padding: '10px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>
          Add
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => handleToggleTodo(todo.id)}
            style={{
              cursor: 'pointer',
              textDecoration: todo.completed ? 'line-through' : 'none',
              padding: '10px',
              backgroundColor: todo.completed ? '#d3ffd3' : '#f0f0f0',
              margin: '5px auto',
              width: '250px',
              borderRadius: '5px',
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