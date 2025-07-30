import React, { useEffect, useState } from 'react';
import CardScroll from '../../cards/card-scroll/CardScroll';
import './TodoDisplay.css';

type TodoDisplayProps = {
    onClose: () => void;
    user_id: number
};

const ToDoDisplay: React.FC<TodoDisplayProps> = ({ onClose, user_id }) => {
    const [todo, setTodo] = useState<number[]>([]);
    const [doing, setDoing] = useState<number[]>([]);
    const [done, setDone] = useState<number[]>([]);

    useEffect(() => {
        fetch(`http://localhost/todo/${user_id}`)
            .then(res => res.json)
            .then(data => {
                for (const item in data) {
                    const toDoItem = JSON.parse(item);
                    switch (toDoItem.status) {
                        case "todo":
                            todo.push(toDoItem.media_id);
                            break;
                        case "doing":
                            todo.push(toDoItem.media_id);
                            break;
                        case "done":
                            todo.push(toDoItem.media_id);
                            break;
                    }
                }
            })
    }, [user_id]);

    return (
        <div className='overlay'>
            <div className='following-content'>
                <div>
                    <h2 className="section-title">Todo</h2>
                    <CardScroll ids={todo} card_type="media" />
                </div>
                <div>
                    <h2 className="section-title">Doing</h2>
                    <CardScroll ids={doing} card_type="media" />
                </div>
                <div>
                    <h2 className="section-title">Done</h2>
                    <CardScroll ids={done} card_type="media" />
                </div>
                <button type="button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ToDoDisplay;
