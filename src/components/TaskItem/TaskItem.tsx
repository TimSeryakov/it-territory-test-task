import React, {ChangeEvent, useState} from 'react'
import {TaskDataType, TaskStatusType} from '../../redux/todolist-reducer'

// ---------------------------------------------------------------------------------------------------------------------

type TaskItemPropsType = {
    removeTask: (id: string) => void
    toggleStatus: (id: string) => void
    editTask: (id: string, newValue: string) => void
} & TaskDataType

// ---------------------------------------------------------------------------------------------------------------------

export const TaskItem = (props: TaskItemPropsType) => {
    const [typedText, setTypedText] = useState<string>(props.title)
    const [editMode, setEditMode] = useState<boolean>(false)

    const styleActive = "text-brand-white text-3xl inline cursor-pointer focus:outline-none"
    const styleDone = "text-brand-border text-3xl line-through inline cursor-pointer focus:outline-none"

// ---------------------------------------------------------------------------------------------------------------------

    const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTypedText(e.currentTarget.value)
    }

    const inputOnKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && typedText) {
            props.editTask(props.id, typedText)
            setEditMode(false)
        }
    }

    const toggleEditMode = () => {
        if (editMode) {
            props.editTask(props.id, typedText)
            setEditMode(false)
        } else {
            setEditMode(true)
        }
    }

// ---------------------------------------------------------------------------------------------------------------------

    return (
        <div className="flex justify-between py-4">
            <div className="cursor-pointer w-full"
                 onClick={() => props.toggleStatus(props.id)}
            >
                {editMode ?
                    <TaskTitleInput value={typedText} onKeyPress={inputOnKeyPressHandler}
                                    onChange={inputOnChangeHandler}/>
                    :
                    <TaskTitle status={props.status} styleActive={styleActive} styleDone={styleDone}
                               title={props.title}/>
                }
            </div>
            <div className="inline flex items-center">
                <button onClick={toggleEditMode}
                        className={`${props.status === "active" ? styleActive : styleDone} p-1`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                    </svg>
                </button>
                <button onClick={() => props.removeTask(props.id)}
                        className={`${props.status === "active" ? styleActive : styleDone} p-1`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------------------------------------------------
// Title components
// ---------------------------------------------------------------------------------------------------------------------

const TaskTitle = (props: { status: TaskStatusType, styleActive: string, styleDone: string, title: string }) => {
    return (
        <h2
            className={props.status === "active" ? props.styleActive : props.styleDone}>
            {props.status === "active" ? <span role="img" aria-label="active">🔥 </span> :
                <span role="img" aria-label="done">👍🏿 </span>}
            {props.title}
        </h2>
    )
}

const TaskTitleInput = (props: { value: string, onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <input value={props.value}
               type="input"
               autoFocus
               className="w-10/12 text-3xl border-b-2 border-brand-border text-brand-border
                                               focus:outline-none bg-brand-dark-primary"
               onKeyPress={props.onKeyPress}
               onChange={props.onChange}
        />
    )
}
