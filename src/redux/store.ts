import {combineReducers, createStore} from "redux";
import todolistReducer, {TodoListActionTypes, TodoListStateType} from "./todolist-reducer";

export type RootStateType = {
    todolist: TodoListStateType
}

export type RootActionsTypes =
    | TodoListActionTypes

const rootReducer = combineReducers({
    todolist: todolistReducer,
})

const store = createStore(rootReducer)

export default store