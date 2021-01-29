import React, {ChangeEvent, useState} from 'react'
import {TaskDataType, TaskStatusType} from '../../redux/todolist-reducer'
import OutsideClickHandler from 'react-outside-click-handler'
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

    const styleActive = "text-gb-text text-3xl inline cursor-pointer focus:outline-none"
    const styleDone = "text-gb-text text-3xl line-through inline cursor-pointer focus:outline-none"

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
                    <TaskTitleInput value={typedText}
                                    onKeyPress={inputOnKeyPressHandler}
                                    onChange={inputOnChangeHandler}
                                    toggleEditMode={toggleEditMode}
                    />
                    :
                    <TaskTitle status={props.status}
                               title={props.title}
                    />
                }
            </div>
            <div className="inline flex items-center">
                <button onClick={toggleEditMode}
                        className={`${props.status === "active" ? styleActive : `${styleDone} hidden`} p-1`}
                >
                    <EditIcon/>
                </button>
                <button onClick={() => props.removeTask(props.id)}
                        className={`${props.status === "active" ? styleActive : styleDone} p-1`}
                >
                    <DeleteIcon/>
                </button>
            </div>
        </div>
    )
}

// Built-in components
//----------------------------------------------------------------------------------------------------------------------

const TaskTitle = (props: { status: TaskStatusType, title: string }) => {

    const styleActive = "text-gb-text text-3xl inline cursor-pointer focus:outline-none"
    const styleDone = "text-gb-text opacity-30 text-3xl line-through inline cursor-pointer focus:outline-none"

    return (
        <div className="text-3xl">
            {
                props.status === "active"
                    ? <span role="img" aria-label="active">🔥 </span>
                    : <span role="img" aria-label="done" className="opacity-50">👍🏿 </span>
            }
            <h2 className={props.status === "active" ? styleActive : styleDone}>
                {props.title}
            </h2>
        </div>
    )
}

const TaskTitleInput = (props: {
    value: string, onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, toggleEditMode: () => void
}) => {
    return (
        <OutsideClickHandler onOutsideClick={props.toggleEditMode}>
            <div className="text-3xl flex">
                <span role="img" aria-label="active">🔥 </span>
                <input value={props.value}
                       type="input"
                       autoFocus
                       className="bg-gb-dark-medium text-gb-light border-gb-text
                                  border-b-2 flex-auto mr-5 ml-3
                                  placeholder-gb-dark-soft focus:outline-none flex-auto"
                       onKeyPress={props.onKeyPress}
                       onChange={props.onChange}
                />
            </div>
        </OutsideClickHandler>
    )
}

// Icons (SVG)
//----------------------------------------------------------------------------------------------------------------------

const EditIcon = () => {
    return (
        <svg className="w-6 h-6 text-gb-blue hover:text-gb-blue-light opacity-70" fill="none" stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2
                     2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    )
}

const DeleteIcon = () => {
    return (
        <svg className="w-6 h-6 text-gb-red hover:text-gb-red-light opacity-70" fill="none" stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5
                     7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    )
}
