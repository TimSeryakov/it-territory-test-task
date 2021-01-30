import {v1} from 'uuid'
import {arrayMove} from 'react-movable'
import {ThunkDispatchType} from './store'
import {TASKS_API} from '../api/api'
import { NOTIFICATION_MESSAGES, setNotificationMessageAC } from './notification-reducer'
import {batch, tasksCollectionRef} from '../api/firebase'

// ---------------------------------------------------------------------------------------------------------------------
// Init State
// ---------------------------------------------------------------------------------------------------------------------

export const initialState: TodoListStateType = {
    tasksData: [
        {id: v1(), order: 0, title: "Grab the gun", status: "active"},
        {id: v1(), order: 1, title: "Check the clip, are there any bullets", status: "active"},
        {id: v1(), order: 2, title: "Take a look into chamber", status: "active"},
        {id: v1(), order: 3, title: "Cock the shutter", status: "active"},
        {id: v1(), order: 4, title: "Remove the safety catch", status: "active"},
        {id: v1(), order: 5, title: "Take aim", status: "active"},
        {id: v1(), order: 6, title: "Decide if you're going to shoot", status: "active"}
    ],
    isFetching: false
}

// ---------------------------------------------------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------------------------------------------------

export type TodoListStateType = {
    tasksData: TaskDataType[]
    isFetching: boolean
}

export type TaskDataType = {
    id: string
    order: number
    title: string
    status: TaskStatusType
}

export type TaskStatusType = "done" | "active"

// ---------------------------------------------------------------------------------------------------------------------
// Action Creators Types
// ---------------------------------------------------------------------------------------------------------------------

export type TodoListActionTypes =
    | ReturnType<typeof setTasksDataAC>
    | ReturnType<typeof setTaskIsFetching>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof toggleTaskStatusAC>
    | ReturnType<typeof editTaskAC>
    | ReturnType<typeof changeTaskOrderAC>


// ---------------------------------------------------------------------------------------------------------------------
// Enum (const)
// ---------------------------------------------------------------------------------------------------------------------

enum TODO {
    SET_TASKS_DATA = "TODO/SET_TASKS_DATA",
    SET_TASKS_IS_FETCHING = "TODO/SET_TASKS_IS_FETCHING",
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
        case TODO.SET_TASKS_DATA: {
            return {
                ...state,
                tasksData: [...action.payload.tasksData.sort((prev, next) => prev.order - next.order)]
            }
        }
        case TODO.SET_TASKS_IS_FETCHING: {
            return {
                ...state,
                isFetching: action.payload.isFetching
            }
        }
        case TODO.ADD_TASK: {
            const newTask: TaskDataType = {id: v1(), order: state.tasksData.length + 1, title: action.payload.title, status: "active"}
            return {
                ...state,
                tasksData: [...state.tasksData, newTask]
            }
        }
        case TODO.REMOVE_TASK: {
            return {
                ...state,
                tasksData: state.tasksData.filter(task => task.id !== action.payload.id)
            }
        }
        case TODO.TOGGLE_TASK_STATUS: {
            return {
                ...state,
                tasksData: state.tasksData
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
                tasksData: state.tasksData
                    .map(task => task.id === action.payload.id
                        ?
                        {...task, title: action.payload.newValue}
                        :
                        task
                    )
            }
        }
        case TODO.CHANGE_TASKS_ORDER: {
            const orderedByIndex = arrayMove<TaskDataType>(
                state.tasksData,
                action.payload.oldIndex,
                action.payload.newIndex
            )

            const orderFieldEqualsArrayIndex = orderedByIndex.map((task, index) => ({...task, order: index}))

            return {
                ...state,
                tasksData: orderFieldEqualsArrayIndex
            }
        }
        default:
            return state
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Action Creators
// ---------------------------------------------------------------------------------------------------------------------

export const setTasksDataAC = (tasksData: TaskDataType[]) =>
    ({type: TODO.SET_TASKS_DATA, payload: {tasksData}}) as const

export const setTaskIsFetching = (isFetching: boolean) =>
    ({type: TODO.SET_TASKS_IS_FETCHING, payload: {isFetching}}) as const



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

// ---------------------------------------------------------------------------------------------------------------------
// Thunk Creators
// ---------------------------------------------------------------------------------------------------------------------


export const requestTasksTC = (): ThunkDispatchType => async (dispatch) => {
    dispatch(setTaskIsFetching(true))
    try {
        const res = await TASKS_API.get()
        dispatch(setTasksDataAC(res))
    } catch(err) { // FIXME
        dispatch(setNotificationMessageAC(NOTIFICATION_MESSAGES.SYNC_ERROR, "error"))
    } finally {
        dispatch(setTaskIsFetching(false))
    }
}

export const updateTasksOrderTC = (oldIndex: number, newIndex: number): ThunkDispatchType => async (dispatch, getState) => {
    // First, we make local changes in state, then synchronize them on the server
    dispatch(changeTaskOrderAC(oldIndex, newIndex))

    const {tasksData} = getState().todolist
    dispatch(setTaskIsFetching(true))
    try {
        for (let i = 0; i < tasksData.length; i++) {
            await tasksCollectionRef.doc(tasksData[i].id).update({order: tasksData[i].order})
        }
    } catch(err) { // FIXME
        dispatch(setNotificationMessageAC(NOTIFICATION_MESSAGES.SYNC_ERROR, "error"))
    } finally {
        dispatch(setTaskIsFetching(false))
    }
}

export default todolistReducer
