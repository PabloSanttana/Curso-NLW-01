import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './screens/Home'
import Points from './screens/Points'
import Detail from './screens/Detail'

const AppStack = createStackNavigator()

const Routes = () =>{
    return(
        <NavigationContainer>
            <AppStack.Navigator initialRouteName='Home' screenOptions={{headerShown:false, cardStyle:{ backgroundColor:"#f0f0f5"}}}>
                <AppStack.Screen name='Home' component={Home} />
                <AppStack.Screen name='Points' component={Points} />
                <AppStack.Screen name='Detail' component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}

export default Routes