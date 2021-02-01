import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Page404} from './Page404/Page404'
import {TodoList} from './TodoList/TodoList'
import {useDispatch, useSelector} from 'react-redux'
import {requestTasks} from '../redux/todolist-reducer'
import {toast} from 'react-toastify'
import {RootStateType} from '../redux/store'
import {makeToast} from '../helpers/makeToast'
import 'react-toastify/dist/ReactToastify.min.css'
import {setNotificationMessageEmptyAC} from '../redux/notification-reducer'

// Toaster turned on
toast.configure()

export const App = () => {
    const {notification} = useSelector((state: RootStateType) => state.notification)
    const dispatch = useDispatch()

    // Put the toast in the toaster
    useEffect(() => {
        if (notification) {
            makeToast(notification)
            dispatch(setNotificationMessageEmptyAC())
        }
    }, [dispatch, notification])

    useEffect(() => {
        dispatch(requestTasks())
    }, [dispatch])

    return (
        <Switch>
            <Route exact path={'/'} render={() => <TodoList/>}/>
            <Route path={"/404"} render={() => <Page404/>}/>
            <Redirect from='*' to="/404"/>
        </Switch>
    )
}
