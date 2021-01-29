import {v1} from "uuid"
import {arrayMove} from "react-movable"

// ---------------------------------------------------------------------------------------------------------------------
// Init State
// ---------------------------------------------------------------------------------------------------------------------

export const initialState: TodoListStateType = {
    todoListData: [
        {id: v1(), title: "Grab the gun", status: "active"},
        {id: v1(), title: "Check the clip, are there any bullets", status: "active"},
        {id: v1(), title: "Take a look into chamber", status: "active"},
        {id: v1(), title: "Cock the shutter", status: "active"},
        {id: v1(), title: "Remove the safety catch", status: "active"},
        {id: v1(), title: "Take aim", status: "active"},
        {id: v1(), title: "Decide if you're going to shoot", status: "active"}
    ]
}

// ---------------------------------------------------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------------------------------------------------

export type TodoListStateType = {
    todoListData: TaskDataType[]
}

export type TaskDataType = {
    id: string
    title: string
    status: TaskStatusType
}

export type TaskStatusType = "done" | "active"

// ---------------------------------------------------------------------------------------------------------------------
// Action Creators Types
// ---------------------------------------------------------------------------------------------------------------------

export type TodoListActionTypes =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof toggleTaskStatusAC>
    | ReturnType<typeof editTaskAC>
    | ReturnType<typeof changeTaskOrderAC>


// ---------------------------------------------------------------------------------------------------------------------
// Enum (const)
// ---------------------------------------------------------------------------------------------------------------------

enum TODO {
    ADD_TASK = "TODO/ADD_TASK",
    REMOVE_TASK = "TODO/REMOVE_TASK",
    TOGGLE_TASK_STATUS = "TODO/TOGGLE_TASK_STATUS",
    EDIT_TASK = "TODO/EDIT_TASK",
    CHANGE_TASKS_ORDER = "TODO/CHANGE_TASKS_ORDER"
}

// ---------------------------------------------------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------------------------------------------------

const todolistReducer = (state: TodoListStateType = initialState, action: TodoListActionTypes): TodoListStateType => {
    switch (action.type) {
        case TODO.ADD_TASK: {
            const newTask: TaskDataType = {id: v1(), title: action.payload.title, status: "active"}
            return {
                ...state,
                todoListData: [...state.todoListData, newTask]
            }
        }
        case TODO.REMOVE_TASK: {
            return {
                ...state,
                todoListData: state.todoListData.filter(task => task.id !== action.payload.id)
            }
        }
        case TODO.TOGGLE_TASK_STATUS: {
            return {
                ...state,
                todoListData: state.todoListData
                    .map(task => task.id === action.payload.id
                        ?
                        {...task, status: task.status === "active" ? "done" : "active"}
                        :
                        task
                    )
            }
        }
        case TODO.EDIT_TASK: {
            return {
                ...state,
                todoListData: state.todoListData
                    .map(task => task.id === action.payload.id
                        ?
                        {...task, title: action.payload.newValue}
                        :
                        task
                    )
            }
        }
        case TODO.CHANGE_TASKS_ORDER: {
            return {
                ...state,
                todoListData: arrayMove<TaskDataType>(
                    state.todoListData,
                    action.payload.oldIndex,
                    action.payload.newIndex
                )
            }
        }
        default:
            return state
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Action Creators
// ---------------------------------------------------------------------------------------------------------------------

export const addTaskAC = (title: string) =>
    ({type: TODO.ADD_TASK, payload: {title}}) as const

export const removeTaskAC = (id: string) =>
    ({type: TODO.REMOVE_TASK, payload: {id}}) as const

export const toggleTaskStatusAC = (id: string) =>
    ({type: TODO.TOGGLE_TASK_STATUS, payload: {id}}) as const

export const editTaskAC = (id: string, newValue: string) =>
    ({type: TODO.EDIT_TASK, payload: {id, newValue}}) as const

export const changeTaskOrderAC = (oldIndex: number, newIndex: number) =>
    ({type: TODO.CHANGE_TASKS_ORDER, payload: {oldIndex, newIndex}}) as const

export default todolistReducer


