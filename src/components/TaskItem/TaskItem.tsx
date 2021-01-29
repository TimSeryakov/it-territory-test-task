import React, {ChangeEvent, forwardRef, Ref, useState} from 'react'
import {TaskDataType, TaskStatusType} from '../../redux/todolist-reducer'
import OutsideClickHandler from 'react-outside-click-handler'
import {IItemProps} from 'react-movable'

type TaskItemPropsType = {
    removeTask: (id: string) => void
    toggleStatus: (id: string) => void
    editTask: (id: string, newValue: string) => void
    focused: boolean
} & TaskDataType & IItemProps

// Draggable item
export const TaskItem = forwardRef(({removeTask, toggleStatus, editTask, focused, ...props}: TaskItemPropsType, ref: Ref<HTMLLIElement>) => {
    const [typedText, setTypedText] = useState<string>(props.title)
    const [editMode, setEditMode] = useState<boolean>(false)

    const styleActive = "text-gb-text text-3xl inline cursor-pointer focus:outline-none"
    const styleDone = "text-gb-text text-3xl line-through inline cursor-pointer focus:outline-none"

    const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTypedText(e.currentTarget.value)
    }

    const inputOnKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && typedText) {
            editTask(props.id, typedText)
            setEditMode(false)
        }
    }

    const toggleEditMode = () => {
        if (editMode) {
            editTask(props.id, typedText)
            setEditMode(false)
        } else {
            setEditMode(true)
        }
    }

    return (
        <li {...props}
            ref={ref}
            className={`${focused ? "bg-gb-dark-soft" : "bg-gb-dark-medium"} 
                        flex justify-between items-center px-2 py-4 my-0.5 rounded-md`
            }
        >
            <DragHandler/>
            <button className="cursor-pointer w-full focus:outline-none"
                    onClick={() => toggleStatus(props.id)}
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
            </button>
            <div className="inline flex items-center">
                <button onClick={toggleEditMode}
                        className={`${props.status === "active" ? styleActive : `${styleDone} hidden`} p-1`}
                >
                    <EditIcon/>
                </button>
                <button onClick={() => removeTask(props.id)}
                        className={`${props.status === "active" ? styleActive : styleDone} p-1`}
                >
                    <DeleteIcon/>
                </button>
            </div>
        </li>
    )
})

//----------------------------------------------------------------------------------------------------------------------
// Built-in components
//----------------------------------------------------------------------------------------------------------------------

const TaskTitle = (props: { status: TaskStatusType, title: string }) => {

    const styleActive = "text-gb-text inline cursor-pointer focus:outline-none text-lg md:text-3xl"
    const styleDone = "text-gb-text opacity-30 line-through inline cursor-pointer focus:outline-none text-lg md:text-3xl"

    return (
        <div className="text-3xl flex items-center">
            <div className="pr-1">
                {
                    props.status === "active"
                        ? <span role="img" aria-label="active">🔥 </span>
                        : <span role="img" aria-label="done" className="opacity-50">👍🏿 </span>
                }
            </div>
            <h2 className={props.status === "active" ? styleActive : styleDone}>
                {props.title}
            </h2>
        </div>
    )
}

const TaskTitleInput = (props: {
    value: string,
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    toggleEditMode: () => void
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

const DragHandler = () => {
    return (
        <div className="py-1 grabbable">
            <DragHandlerIcon/>
        </div>
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

const DragHandlerIcon = () => {
    return (
        <svg className="w-6 h-6 mt-2 text-gb-text opacity-40" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2
                     2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2
                     2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
            />
        </svg>
    )
}