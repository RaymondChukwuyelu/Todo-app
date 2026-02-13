//imported for use
import React, { useEffect, useState } from 'react'
import '../styles/home.css'
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { X } from 'lucide-react';

// type for the todo array Objects
type Todo = {
    id: number;
    text: string;
    completed: boolean;
};


const Home = () => {
    //managing states of our app
    const [text, setText] = useState("")
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [draggingId, setDraggingId] = useState<number | null>(null)
    const [dragOverId, setDragOverId] = useState<number | null>(null);


    const [theme, setTheme] = useState<"light" | "dark">(() => {
        // toggling dark / light mode and saving to local storage
        return localStorage.getItem("theme") as "light" | "dark" || "dark"
    })

    const [todos, setTodos] = useState<Todo[]>(() => {
        // todos state which is loaded from local storage
        try {
            const saved = localStorage.getItem("todos");
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            console.error("Failed to parse todos from localStorage:", err);
            return [];
        }
    })


    const toggleTheme = () => {
        // toggle theme state function
        setTheme(theme === "light" ? "dark" : "light")
    }

    const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
        //function for adding todo to our todos arrays state.
        if (e.key === "Enter" && text.trim() !== '') {
            const newTodo = { id: Date.now(), text: text.trim(), completed: false }
            setTodos([newTodo, ...todos])
            setText("")

        }
    }

    const displayTodos = (() => {
        // logic for displaying todos based on conditions all / active / completed. 
        if (filter === "all") return todos

        if (filter === "active") return todos.filter(todo => !todo.completed)

        if (filter === "completed") return todos.filter(todo => todo.completed);
        return todos
    })()

    const handleInputCheck = () => {
        //Function handling the checkbox of the addtodo input

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
        //Function handling the toggling the checked property for our todos 
        setTodos(
            todos.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    const deleteTodo = (id: number) => {
        // function handling the deletion of todos
        const undeletedTodos = todos.filter(todo => todo.id !== id)
        setTodos(undeletedTodos)
    }

    const clearCompleted = () => {
        // Function to deleting completed todos
        setTodos(todos.filter(todo => !todo.completed));
    }

    const onDragEnd = () => {
        // function for cleaning up after drag is over
        setDraggingId(null)
        setDragOverId(null)
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        //Function for storing the index of the element dragged over
        e.preventDefault()
        setDragOverId(id)
    }

    const handleDrop = (id: number) => {
        //function for handling when the element is dropped
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
        // useEffect for storing the theme values to local storage whenever the value changes 
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        // useEffect for storing the todoos to local storage when the value changes

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
                    {/* JSX for handling the todo input  */}
                    <input type="checkbox" className="circle-checkbox" onChange={handleInputCheck} checked={checkboxChecked} />
                    <input type='text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Create a new todo' onKeyDown={addTodo} className='addTodoInput' />
                </div>

                <div className='container5'>
                    {/* displaying of todos */}
                    {displayTodos.length === 0 ? (
                        <div className="no-todos">
                            {filter === "all" && "No tasks found"}
                            {filter === "active" && "No active tasks found"}
                            {filter === "completed" && "No completed tasks found"}
                        </div>
                    ) : (displayTodos?.map((todo, i) => {
                        return (
                            <div
                                className={`container6 ${draggingId === todo.id ? 'dragging' : ''} ${dragOverId === todo.id && draggingId !== todo.id ? 'container6b' : ''
                                    }`}
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
                    })
                    )}
                </div>

                <div className={`container7 ${displayTodos.length === 0 || displayTodos.length === 1 ? 'notask' : ''}`}>
                    <span> {todos.filter(todo => !todo.completed).length} items left</span>
                    <div>
                        <button className={filter === "all" ? "active" : ""}
                            onClick={() => setFilter("all")}>All</button>
                        <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Active</button>
                        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
                    </div>
                    <button onClick={clearCompleted}>Clear Completed</button>
                </div>

                <span className="drag-text">Drag and drop to re order list </span>

            </div>
        </div>
    )
}

export default Home