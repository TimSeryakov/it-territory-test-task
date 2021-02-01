import {arrayMove} from 'react-movable'
import {RootStateType, ThunkDispatchType} from './store'
import {TASKS_API} from '../api/api'
import {NOTIFICATIONS, setNotificationMessageAC} from './notification-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'


// types
// ---------------------------------------------------------------------------------------------------------------------
export type TodoListStateType = {
    tasks: TaskDataType[]
    isSyncing: boolean
}

export type TaskDataType = {
    id: string
    order: number
    title: string
    status: TaskStatusType
}

export type TaskStatusType = "done" | "active"

// action creators types
// ---------------------------------------------------------------------------------------------------------------------
export type TodoListActionTypes =
// | ReturnType<typeof setTasksAC>
// | ReturnType<typeof removeTaskAC>
// | ReturnType<typeof addTaskAC>
    | ReturnType<typeof setIsSyncing>
    | ReturnType<typeof toggleTaskStatusAC>
    | ReturnType<typeof editTaskTitleAC>
    | ReturnType<typeof changeTaskOrderAC>

// thunk creators
// ---------------------------------------------------------------------------------------------------------------------
export const requestTasks = createAsyncThunk<{ tasks: TaskDataType[] }, undefined, { state: RootStateType }>('todolist/requestTasks',
    async (unknown, thunkAPI) => {
        thunkAPI.dispatch(setIsSyncing({isSyncing: true}))
        try {
            const res = await TASKS_API.get()
            return {tasks: res}
        } finally {
            thunkAPI.dispatch(setIsSyncing({isSyncing: false}))
        }
    })

export const removeTask = createAsyncThunk('todolist/removeTask',
    async (id: string, thunkAPI) => {

        thunkAPI.dispatch(setIsSyncing({isSyncing: true}))
        try {
            await TASKS_API.delete(id)
            return {id}
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        } finally {
            thunkAPI.dispatch(setIsSyncing({isSyncing: false}))
        }
    })


export const updateTasksOrderTC = createAsyncThunk<unknown, { data: { oldIndex: number, newIndex: number } }, { state: RootStateType }>('todolist/updateTasksOrder',
    async ({data: {oldIndex, newIndex}}, thunkAPI) => {

        thunkAPI.dispatch(changeTaskOrderAC({oldIndex, newIndex}))
        const {tasks} = thunkAPI.getState().todolist
        thunkAPI.dispatch(setIsSyncing({isSyncing: true}))
        try {
            await TASKS_API.updateOrder(tasks)
        } catch {
            // Restore the previous state
            thunkAPI.dispatch(changeTaskOrderAC({newIndex, oldIndex}))
            thunkAPI.dispatch(setNotificationMessageAC({message: NOTIFICATIONS.SYNC_ERROR, type: "error"}))
        } finally {
            thunkAPI.dispatch(setIsSyncing({isSyncing: false}))
        }
    })

export const toggleTaskStatusTC = createAsyncThunk<unknown, { id: string }, { state: RootStateType }>('todolist/toggleTaskStatus',
    async ({id}, {getState, dispatch}) => {

        dispatch(toggleTaskStatusAC({id}))
        const {tasks} = getState().todolist

        const task = tasks.find(task => task.id === id)

        // Trying to sync
        if (task) {
            dispatch(setIsSyncing({isSyncing: true}))
            try {
                await TASKS_API.update(id, task)
            } catch {
                // Restore the previous state
                dispatch(toggleTaskStatusAC({id}))
                dispatch(setNotificationMessageAC({message: NOTIFICATIONS.SYNC_ERROR, type: "error"}))
            } finally {
                dispatch(setIsSyncing({isSyncing: false}))
            }
        }
    })

// FIXME any
export const addTaskTC = createAsyncThunk<{ task: TaskDataType } | any, { title: string }, { state: RootStateType }>('todolist/addTask',
    async ({title}, {getState, dispatch}) => {

        const order = getState().todolist.tasks.length + 1
        dispatch(setIsSyncing({isSyncing: true}))
        try {
            const task: TaskDataType = await TASKS_API.add(title, order)
            return {task}
        } catch {
            dispatch(setNotificationMessageAC({message: NOTIFICATIONS.SYNC_ERROR, type: "error"}))
        } finally {
            dispatch(setIsSyncing({isSyncing: false}))
        }

    })


export const editTaskTitleTC = (id: string, title: string): ThunkDispatchType => async (dispatch, getState) => {
    // Save original task title to be able to restore
    const originalTasks = getState().todolist.tasks
    const originalTask = originalTasks.find(task => task.id === id)
    const originalTaskTitle = originalTask && originalTask.title

    // Change local value
    dispatch(editTaskTitleAC({id, title}))
    const modifiedTasks = getState().todolist.tasks
    const modifiedTask = modifiedTasks.find(task => task.id === id)

    // Trying to sync
    if (modifiedTask) {
        dispatch(setIsSyncing({isSyncing: true}))
        try {
            await TASKS_API.update(id, modifiedTask)
                .catch(() => {
                    console.log("ERROR")
                    dispatch(editTaskTitleAC({id, title: originalTaskTitle ? originalTaskTitle : title}))
                    dispatch(setNotificationMessageAC({message: NOTIFICATIONS.SYNC_ERROR, type: "error"}))
                })
        } catch {
            // Restore the previous state
            dispatch(editTaskTitleAC({id, title: originalTaskTitle ? originalTaskTitle : title}))
            dispatch(setNotificationMessageAC({message: NOTIFICATIONS.SYNC_ERROR, type: "error"}))
        } finally {
            dispatch(setIsSyncing({isSyncing: false}))
        }
    }
}


// reducer
// ---------------------------------------------------------------------------------------------------------------------
const slice = createSlice({
    name: "todolist",
    initialState: {
        tasks: [],
        isSyncing: false
    } as TodoListStateType,
    reducers: {
        // setTasksAC(state, action: PayloadAction<{ tasks: TaskDataType[] }>) {
        //     state.tasks = action.payload.tasks.sort((prev, next) => prev.order - next.order)
        // },
        // removeTaskAC(state, action: PayloadAction<{ id: string }>) {
        //     state.tasks = state.tasks.filter(task => task.id !== action.payload.id)
        // },
        // addTaskAC(state, action: PayloadAction<{ task: { id: string, title: string, order: number, status: TaskStatusType } }>) {
        //     state.tasks = [...state.tasks, action.payload.task]
        // },
        setIsSyncing(state, action: PayloadAction<{ isSyncing: boolean }>) {
            state.isSyncing = action.payload.isSyncing
        },
        toggleTaskStatusAC(state, action: PayloadAction<{ id: string }>) {
            state.tasks = state.tasks.map(task => task.id === action.payload.id
                ? {...task, status: task.status === "active" ? "done" : "active"}
                : task
            )
        },
        editTaskTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            state.tasks = state.tasks.map(task => task.id === action.payload.id
                ? {...task, title: action.payload.title}
                : task
            )
        },
        changeTaskOrderAC(state, action: PayloadAction<{ oldIndex: number, newIndex: number }>) {
            const orderedByIndex = arrayMove<TaskDataType>(
                state.tasks,
                action.payload.oldIndex,
                action.payload.newIndex
            )
            // .order fields must equal array index
            state.tasks = orderedByIndex.map((task, index) => ({...task, order: index}))
        }
    },
    extraReducers: (builder) => {
        builder.addCase(requestTasks.fulfilled, (state, action) => {
            state.tasks = action.payload.tasks.sort((prev, next) => prev.order - next.order)
        })
        builder.addCase(removeTask.fulfilled, (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload.id)
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state.tasks = [...state.tasks, action.payload.task]
        })
    }
})

// actions creators export
// ---------------------------------------------------------------------------------------------------------------------
export const {
    /*addTaskAC,*/ changeTaskOrderAC, editTaskTitleAC, /*removeTaskAC,*/
    setIsSyncing, /*setTasksAC,*/ toggleTaskStatusAC
} = slice.actions


// ---------------------------------------------------------------------------------------------------------------------
const todolistReducer = slice.reducer
export default todolistReducer
