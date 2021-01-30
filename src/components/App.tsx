import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Page404} from './Page404/Page404'
import {TodoList} from './TodoList/TodoList'
import {tasksCollectionRef} from '../api/firebase'
import {useDispatch} from 'react-redux';
import { requestTasksTC } from '../redux/todolist-reducer'

export const App = () => {
    const dispatch = useDispatch()

    useEffect (() => {
        dispatch(requestTasksTC())
    }, [dispatch])

    return (
        <div className="bg-brand-dark-primary w-full h-full">
            <Switch>
                <Route exact path={'/'} render={() => <TodoList/>}/>
                <Route exact path={'/test'} render={() => <Test/>}/>
                <Route path={"/404"} render={() => <Page404/>}/>
                <Redirect from='*' to="/404"/>
            </Switch>
        </div>
    )
}

function Test() {

    const dispatch = useDispatch()

    const todoListData = [
        {id: "TIsd8q9WB5TnyvINZa9Z", order: 0, title: "Grab the gun", status: "active"},
        {id: "nOjNH6EpH2e1YWn8D5xR", order: 1, title: "Check the clip, are there any bullets", status: "active"},
        {id: "Icm3depyZH3yrp03mKDs", order: 2, title: "Take a look into chamber", status: "active"},
        {id: "lFgyTT7wDpNG7F2jmywz", order: 3, title: "Cock the shutter", status: "active"},
        {id: "9KBUa7n7b7uAKLdRtxoJ", order: 4, title: "Remove the safety catch", status: "active"},
        {id: "xNEhQS6feZXaOG908R0r", order: 5, title: "Take aim", status: "active"},
        {id: "6Ec6LgchANjtuwbCofJ6", order: 6, title: "Decide if you're going to shoot", status: "active"}
    ]

    const go = () => {
        for (let i = 0; i < todoListData.length; i++) {
            // tasksCollectionRef.add(todoListData[i]).then(console.log)
            tasksCollectionRef.doc(todoListData[i].id).update({order: todoListData[i].order}).then(console.log)
        }
    }

    const get = () => {
        dispatch(requestTasksTC())
    }

    return (
        <>
            <div>
                <button className="p-4 bg-red-300" onClick={go}>go</button>
            </div>
            <hr/>
            <div>
                <button className="p-4 bg-red-300" onClick={get}>get</button>
            </div>
        </>
    )
}
