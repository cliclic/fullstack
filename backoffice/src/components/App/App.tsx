import './App.scss'
import React, { Suspense } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import AuthenticatedRoute from '../Router/AuthenticatedRoute'
import Login from '../Login'
import Home from '../Home'

const LoadingMessage = () => <div> "I'm loading..." </div>

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <Suspense fallback={<LoadingMessage />}>
            <Login />
          </Suspense>
        </Route>
        <Suspense fallback={<LoadingMessage />}>
          <AuthenticatedRoute component={Home} />
        </Suspense>
      </Switch>
    </BrowserRouter>
  )
}

export default App
