import React, { useEffect, useState } from 'react'
import '../styles/home.css'
import { ClosedCaptionIcon, Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { X } from 'lucide-react';

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};


const Home = () => {
    const [text, setText] = useState("")
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [draggingId, setDraggingId] = useState<number | null>(null)
    const [dragOverId, setDragOverId] = useState<number | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        return localStorage.getItem("theme") as "light" | "dark" || "dark"
    })

    const [todos, setTodos] = useState<Todo[]>(() => {
        try {
            const saved = localStorage.getItem("todos");
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            console.error("Failed to parse todos from localStorage:", err);
            return [];
        }
    })


    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && text.trim() !== '') {
            const newTodo = { id: Date.now(), text: text.trim(), completed: false }
            setTodos([newTodo, ...todos])
            setText("")

        }
    }

    const displayTodos = (() => {
        if (filter === "all") return todos

        if (filter === "active") return todos.filter(todo => !todo.completed)

        if (filter === "completed") return todos.filter(todo => todo.completed);
        return todos
    })()

    const handleInputCheck = () => {
        if (text.trim() === "") return;

        setCheckboxChecked(true);

        const newTodo = {
            id: Date.now(),
            text: text.trim(),
            completed: true,
        };

        setTodos([newTodo, ...todos]);

        setText("");
        setTimeout(() => setCheckboxChecked(false), 300);
    }

    const toggleComplete = (id: number) => {
        setTodos(
            todos.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    const deleteTodo = (id: number) => {
        const undeletedTodos = todos.filter(todo => todo.id !== id)
        setTodos(undeletedTodos)
    }

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    }

    const onDragEnd = () => {
        setDraggingId(null)
        setDragOverId(null)
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.preventDefault()
        setDragOverId(id)
    }

    const handleDrop = (id: number) => {
        if (draggingId === null) return;

        const draggedIndex = todos.findIndex(todo => todo.id === draggingId);
        const dropIndex = todos.findIndex(todo => todo.id === id);
        if (draggedIndex === -1 || dropIndex === -1) return;
        const updatedTodos = [...todos];
        const [draggedTodo] = updatedTodos.splice(draggedIndex, 1);
        updatedTodos.splice(dropIndex, 0, draggedTodo);

        setTodos(updatedTodos);
        setDraggingId(null);
        setDragOverId(null);
    }
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    return (
        <div className='container1'>
            <div className='container2'>
                <div className='container3'>
                    <h1 className='header-text'>TODO</h1>
                    <button className='toggle-btn' onClick={toggleTheme}>
                        {theme === "dark" ? <Sun size={28} /> : <Moon size={28} />}
                    </button>
                </div>

                <div className='container4'>
                    <input type="checkbox" className="circle-checkbox" onChange={handleInputCheck} checked={checkboxChecked} />
                    <input type='text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Create a new todo' onKeyDown={addTodo} className='addTodoInput' />
                </div>

                <div className='container5'>
                    {displayTodos?.map((todo, i) => {
                        return (
                            <div
                                className='container6'
                                key={todo.id}
                                draggable
                                onDragStart={() => setDraggingId(todo.id)}
                                onDragEnd={onDragEnd}
                                onDragOver={(e) => onDragOver(e, todo.id)}
                                onDrop={() => handleDrop(todo.id)}
                            >
                                <div>
                                    <input type="checkbox" className='circle-checkbox' checked={todo.completed} onChange={() => toggleComplete(todo.id)}
                                    />
                                    <div className={`${todo.completed ? 'todoText completed' : 'todoText'}`}>{todo.text}
                                    </div>
                                </div>
                                <button onClick={() => deleteTodo(todo.id)}>{<X />}</button>
                            </div>
                        )
                    })}
                    <div className='container7'>
                        <span> {todos.filter(todo => !todo.completed).length} items left</span>
                        <div>
                            <button className={filter === "all" ? "active" : ""}
                                onClick={() => setFilter("all")}>All</button>
                            <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Active</button>
                            <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
                        </div>
                        <button onClick={clearCompleted}>Clear Completed</button>
                    </div>
                </div>

                <span className='drag-text'>Drag and drop to re order list </span>

            </div>
        </div>
    )
}

export default Home