import React, { useState, useEffect } from 'react';

// --- Helper Components ---

// Icon for the app title
const TitleIcon = () => (
  <svg className="w-8 h-8 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
  </svg>
);

// Icon for the AI assistant
const AiIcon = () => (
    <svg className="w-6 h-6 mr-2 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.373 3.373 0 0012 18.443V21M12 4.5A2.5 2.5 0 009.5 7a2.5 2.5 0 002.5 2.5A2.5 2.5 0 0014.5 7 2.5 2.5 0 0012 4.5z"></path>
    </svg>
);

// Icon for a completed task
const CheckIcon = () => (
    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

// Icon for an incomplete task
const CircleIcon = () => (
    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

// Icon for deleting a task
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);


// --- Main App Component ---

export default function Home() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleEdit = (todo) => {
        setEditingId(todo.id);
        setEditingText(todo.text);
    };

    const handleUpdate = (e, id) => {
        e.preventDefault();
        setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editingText } : todo));
        setEditingId(null);
        setEditingText('');
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    // NEW: Calculate the number of completed todos
    const completedCount = todos.filter(todo => todo.completed).length;

    const handleAiSubmit = async (e) => {
        e.preventDefault();
        if (!aiQuestion.trim()) return;
        setIsLoading(true);
        setAiAnswer('');
        try {
            const answer = await getAiResponse(aiQuestion);
            setAiAnswer(answer);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setAiAnswer('Sorry, something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const getAiResponse = async (prompt) => {
        const apiKey = "AIzaSyDEBBIDHGvVa1p0TapfmHFC6EVxel1zwEM"; // Remember to add your key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Could not find text in the API response.");
        return text;
    };

    return (
        <div className="bg-slate-900 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <TitleIcon />
                        <h1 className="text-4xl font-bold text-gray-100">TaskMaster AI</h1>
                    </div>
                    <p className="text-gray-400">An intelligent To-Do list that remembers your tasks.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/30">
                        <h2 className="text-2xl font-semibold text-gray-200 mb-4">My Tasks</h2>
                        <form onSubmit={addTodo} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-grow p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition bg-slate-700/50 text-gray-100 placeholder-gray-400"
                            />
                            <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 font-semibold transition shadow-md hover:shadow-lg">Add</button>
                        </form>

                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                            <div className="flex gap-2">
                                <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-gray-300'}`}>All</button>
                                <button onClick={() => setFilter('active')} className={`px-3 py-1 text-sm rounded-full ${filter === 'active' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-gray-300'}`}>Active</button>
                                <button onClick={() => setFilter('completed')} className={`px-3 py-1 text-sm rounded-full ${filter === 'completed' ? 'bg-sky-600 text-white' : 'bg-slate-700 text-gray-300'}`}>Completed</button>
                            </div>
                            {/* UPDATED: Changed button shape and padding */}
                            {completedCount > 0 && (
                                <button 
                                    onClick={clearCompleted} 
                                    className="text-sm text-red-400 border border-red-400/50 rounded-md px-2 py-1 hover:bg-red-400/20 hover:text-red-300 transition-colors"
                                >
                                    Clear ({completedCount})
                                </button>
                            )}
                        </div>

                        <ul className="space-y-3">
                            {filteredTodos.map((todo) => (
                                <li key={todo.id} className="flex items-center p-2 rounded-lg group bg-slate-700/40 hover:bg-slate-700/70 transition-all">
                                    <button onClick={() => toggleTodo(todo.id)} className="p-1">
                                        {todo.completed ? <CheckIcon /> : <CircleIcon />}
                                    </button>
                                    
                                    {editingId === todo.id ? (
                                        <form onSubmit={(e) => handleUpdate(e, todo.id)} className="flex-grow">
                                            <input
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                onBlur={(e) => handleUpdate(e, todo.id)}
                                                autoFocus
                                                className="w-full mx-2 p-1 bg-slate-600 border border-sky-500 rounded text-gray-100"
                                            />
                                        </form>
                                    ) : (
                                        <span
                                            onDoubleClick={() => handleEdit(todo)}
                                            className={`flex-grow mx-2 cursor-pointer ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}
                                        >
                                            {todo.text}
                                        </span>
                                    )}
                                    
                                    <button onClick={() => deleteTodo(todo.id)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/30">
                        <h2 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center"><AiIcon /> AI Assistant</h2>
                        <form onSubmit={handleAiSubmit} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={aiQuestion}
                                onChange={(e) => setAiQuestion(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-grow p-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition bg-slate-700/50 text-gray-100 placeholder-gray-400"
                            />
                            <button type="submit" disabled={isLoading} className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 font-semibold transition disabled:bg-sky-400/50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                                {isLoading ? 'Thinking...' : 'Ask'}
                            </button>
                        </form>
                        <div className="bg-slate-900/80 p-4 rounded-lg min-h-[150px] prose prose-sm max-w-none">
                            {isLoading && <p className="text-gray-400 animate-pulse">The AI is thinking...</p>}
                            {aiAnswer && <p className="text-gray-300">{aiAnswer}</p>}
                            {!aiAnswer && !isLoading && <p className="text-gray-500">Your answer will appear here.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
