import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Page404} from "./Page404/Page404"
import {TodoList} from "./TodoList/TodoList"

export const App = () => {
    return (
        <div className="bg-brand-dark-primary w-full h-full">
            <Switch>
                <Route exact path={'/'} render={() => <TodoList/>}/>
                <Route path={"/404"} render={() => <Page404/>}/>
                <Redirect from='*' to="/404"/>
            </Switch>
        </div>
    )
}