import React from 'react'
import { Route, BrowserRouter, Switch} from 'react-router-dom'

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'
import PageNotFound from './pages/error'

const Routes = () =>{
    return(
        <BrowserRouter>
            <Switch>
                <Route component={Home} path="/" exact />
                <Route component={CreatePoint} path="/create-point" exact />
                <Route component={PageNotFound} path="**"/>
                
            </Switch>
        </BrowserRouter>
    )
}

export default Routes