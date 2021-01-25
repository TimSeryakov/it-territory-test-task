import React, {ChangeEvent, useCallback, useState} from 'react'
import {TaskItem} from '../TaskItem/TaskItem'
import {RootStateType} from "../../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {addTaskAC, editTaskAC, removeTaskAC, toggleTaskStatusAC} from '../../redux/todolist-reducer';

// ---------------------------------------------------------------------------------------------------------------------

export const TodoList = () => {
    const [typedText, setTypedText] = useState<string | null>()
    const selector = useCallback((state: RootStateType) => state.todolist, [])
    const {todoListData} = useSelector(selector)
    const dispatch = useDispatch()

// ---------------------------------------------------------------------------------------------------------------------

    const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTypedText(e.currentTarget.value)
    }

    const inputOnKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && typedText) {
            dispatch(addTaskAC(typedText))
            setTypedText(null)
        }
    }

    const addTask = () => {
        if (typedText) {
            dispatch(addTaskAC(typedText))
            setTypedText(null)
        }
    }

    const editTask = (id: string, newValue: string) => {
        dispatch(editTaskAC(id, newValue))
    }
    const toggleStatus = (id: string) => {
        dispatch(toggleTaskStatusAC(id))
    }
    const removeTask = (id: string) => {
        dispatch(removeTaskAC(id))
    }

// ---------------------------------------------------------------------------------------------------------------------

    return (
        <section>
            <header className="text-brand-border">
                <a href="https://youtu.be/5coefdzLlYc" target="_blank" rel="noreferrer">
                    <h1 className="text-4xl my-3">Watcha gonna do, whatcha gonna do</h1>
                    <h2 className="text-xl my-1">When they come for you</h2>
                    <h3 className="text-sm ">Bad boys, bad boys...</h3>
                </a>
            </header>
            <div className="mt-10">
                <input value={typedText ? typedText : ""}
                       type="input"
                       placeholder="Type something..."
                       className="border-brand-border hover:text-brand-white hover:border-brand-white rounded-md
                                      border p-3 text-brand-white text-2xl mx-2 bg-brand-dark-primary w-9/12
                                      placeholder-brand-dark-secondary focus:outline-none"
                       onChange={inputOnChangeHandler}
                       onKeyPress={inputOnKeyPressHandler}
                />
                <button className="border-brand-border hover:text-brand-white hover:border-brand-white rounded-md
                                       border p-3 text-brand-border text-2xl mx-2 focus:outline-none focus:outline-none"
                        onClick={addTask}
                >
                    Smack!
                </button>
            </div>
            <main className="mt-5">
                {
                    todoListData.map(task => {
                        return (
                            <TaskItem id={task.id}
                                      key={task.id}
                                      status={task.status}
                                      title={task.title}
                                      removeTask={removeTask}
                                      toggleStatus={toggleStatus}
                                      editTask={editTask}
                            />
                        )
                    })
                }
            </main>
        </section>
    )
}