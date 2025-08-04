import React, { useEffect, useState } from 'react';
import '../button/Button.css';

type ToDoButtonProps = {
    style: string;
    media_id: number;
};

const ToDoButton: React.FC<ToDoButtonProps> = ({ style, media_id }) => {
    const [onList, setOnList] = useState(false);
    const [user_id, setUserId] = useState<number | null>(null);

    async function update(user_id: number) {
        const url: string = `http://localhost:3000/todo/${user_id}/${media_id}`;
        const response = await fetch(url);
        const result = await response.json();

        setOnList(result.onlist);
    }

    async function postTodo() {
        const url: string = `http://localhost:3000/todo`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, media_id })
        };
        const response = await fetch(url, options);
        if (user_id) {
            update(user_id);
        }
    }

    async function deleteTodo() {
        const url: string = `http://localhost:3000/todo/${user_id}/${media_id}`;
        const options = {
            method: 'DELETE'
        };
        const response = await fetch(url, options);
        if (user_id) {
            update(user_id);
        }
    }

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const storedUserId = JSON.parse(stored).user_id
            setUserId(storedUserId);
            update(storedUserId);
        }
    }, [user_id, media_id])

    function loadTodoButton() {
        return (user_id && media_id ? onList ? <button className={style} onClick={() => deleteTodo()}>Remove from Todo</button> : <button className={style} onClick={() => postTodo()}>Add to Todo</button> : null)
    }

    return (loadTodoButton())
};

export default ToDoButton;