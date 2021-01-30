import {applyMiddleware, combineReducers, createStore} from 'redux'
import notificationReducer, {NotificationActionTypes, NotificationStateType} from './notification-reducer'
import todolistReducer, {TodoListActionTypes, TodoListStateType} from './todolist-reducer'
import logger from 'redux-logger'
import thunkMiddleware, {ThunkAction} from 'redux-thunk'

export type RootStateType = {
    todolist: TodoListStateType
    notification: NotificationStateType
}

export type RootActionsTypes =
    | TodoListActionTypes
    | NotificationActionTypes

export type ThunkDispatchType = ThunkAction<void | Promise<void>, RootStateType, unknown, RootActionsTypes>

const rootReducer = combineReducers({
    todolist: todolistReducer,
    notification: notificationReducer
})

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))

export default store