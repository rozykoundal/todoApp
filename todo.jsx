import React, { useState, useEffect } from "react";
import "./todo.css";

export default function Todo() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos")) || [];
    } catch (e) {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    if (editId === null) {
      // add
      const newTodo = { id: Date.now(), text: value };
      setTodos((s) => [newTodo, ...s]);
      setText("");
    } else {
      // update
      setTodos((s) =>
        s.map((t) => (t.id === editId ? { ...t, text: value } : t))
      );
      setText("");
      setEditId(null);
    }
  }

  function handleEdit(id) {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setText(t.text);
    setEditId(id);
  }

  function handleDelete(id) {
    setTodos((s) => s.filter((t) => t.id !== id));
    if (editId === id) {
      setEditId(null);
      setText("");
    }
  }

  function handleClearAll() {
    if (!todos.length) return;
    if (confirm("Clear all todos?")) setTodos([]);
  }

  return (
    <div className="todo-app">
      <h2 className="todo-title">Todo</h2>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="todo-input"
          placeholder="Write a todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="todo-btn">
          {editId === null ? "Add" : "Update"}
        </button>
      </form>

      <div className="todo-list-wrapper">
        {todos.length === 0 ? (
          <p className="empty">No todos yet — add one above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((t) => (
              <li key={t.id} className="todo-item">
                <span className="todo-text">{t.text}</span>

                <div className="todo-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEdit(t.id)}
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(t.id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="todo-footer">
        <button className="clear-btn" onClick={handleClearAll}>
          Clear All
        </button>
        <span className="count">{todos.length} items</span>
      </div>
    </div>
  );
}
