
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './App.css';
import './todo-create.js';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [todos, darkMode]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos([...todos, {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false
    }]);

    setNewTodo('');
  };

  const handleToggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              justCompleted: !todo.completed
            }
          : { ...todo, justCompleted: false }
      )
    );
  };

  useEffect(() => {
    const todoWithConfetti = todos.find(todo => todo.justCompleted);
    if (todoWithConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [todos]);

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverItem(index);
  };

  const handleDrop = () => {
    if (draggedItem === null || draggedOverItem === null) return;

    const newTodos = [...todos];
    const draggedTodo = newTodos[draggedItem];

    newTodos.splice(draggedItem, 1);
    newTodos.splice(draggedOverItem, 0, draggedTodo);

    setTodos(newTodos);
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`todo-app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <header className="app-header">
          <h1>TODO</h1>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? (
              <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </header>

        <form onSubmit={handleAddTodo} className="todo-form">
          <div className="checkbox-circle"></div>
          <input
            type="text"
            placeholder="Create a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input"
          />
        </form>

        <div className="todo-list-container">
          {filteredTodos.length > 0 ? (
            <ul className="todo-list">
              {filteredTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDrop}
                >
                  <div className="todo-content">
                    <div
                      className={`checkbox-circle ${todo.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleTodo(todo.id)}
                    >
                      {todo.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                          <path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6" />
                        </svg>
                      )}
                    </div>
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                      <path
                        fill="#494C6B"
                        fillRule="evenodd"
                        d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No todos to display</p>
            </div>
          )}

          <div className="todo-footer">
            <span className="items-left">{activeTodosCount} items left</span>

            <div className="filters desktop-filters">
              <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
                All
              </button>
              <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>
                Active
              </button>
              <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>
                Completed
              </button>
            </div>

            <button onClick={handleClearCompleted} className="clear-completed">
              Clear Completed
            </button>
          </div>
        </div>

        <div className="mobile-filters">
          <div className="filters">
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
              All
            </button>
            <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>
              Active
            </button>
            <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>
              Completed
            </button>
          </div>
        </div>

        <p className="drag-drop-text">Drag and drop to reorder list</p>
      </div>
    </div>
  );
}

export default App;