import {combineReducers} from 'redux'
import notificationReducer, {NotificationActionTypes} from './notification-reducer'
import todolistReducer, { TodoListActionTypes } from './todolist-reducer'
import thunkMiddleware, {ThunkAction} from 'redux-thunk'
import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from "react-redux";

// export type RootStateType = {
//     todolist: TodoListStateType
//     notification: NotificationStateType
// }

// export type RootStateType = ReturnType<typeof rootReducer>
export type RootStateType = ReturnType<typeof store.getState>
type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()

export type RootActionsTypes =
    | TodoListActionTypes
    | NotificationActionTypes

export type ThunkDispatchType = ThunkAction<void | Promise<void>, RootStateType, unknown, RootActionsTypes>


const rootReducer = combineReducers({
    todolist: todolistReducer,
    notification: notificationReducer
})

// const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware) // .concat(logger)
})


export default store