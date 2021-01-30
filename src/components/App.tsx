import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Page404} from './Page404/Page404'
import {TodoList} from './TodoList/TodoList'
import {TASKS_API} from '../api/api'

export const App = () => {
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

    const go = () => {
        TASKS_API.add({title: "Check the clip, are there any bullets", order: 0, status: "active"}).then(console.log)
    }

    return  (
        <div>
            <button className="p-4 bg-red-300" onClick={go}>go</button>
        </div>
    )
}
