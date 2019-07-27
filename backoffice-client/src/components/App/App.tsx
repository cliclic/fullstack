import './App.scss'
import React, { Suspense } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import AuthenticatedRoute from '../Router/AuthenticatedRoute'
import Login from '../Login'
import Home from '../Home'
import {LoadingMessage} from "../common/LoadingMessage";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login">
                    <Suspense fallback={<LoadingMessage />}>
                        <Login />
                    </Suspense>
                </Route>
                <AuthenticatedRoute>
                    <Suspense fallback={<LoadingMessage />}>
                        <Home />
                    </Suspense>
                </AuthenticatedRoute>
            </Switch>
        </BrowserRouter>
    )
}

export default App
