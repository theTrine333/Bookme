import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Recent from './screens/Recent'
import Home from './screens/Home'
import Downloads from './screens/Downloads'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

const Navigation = ({navigation}) => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon : () => (
          <Ionicons name="home-outline" size={18}/>
        ),
      }}/>
      <Tab.Screen name="Recent" component={Recent} options={{
        tabBarIcon : () => (
          <Ionicons name="sync" size={19}/>
        ),
      }}/>
      <Tab.Screen name="Downloads" component={Downloads} options={{
        tabBarIcon : () => (
          <Ionicons name="cloud-download-outline" size={19}/>
        ),
      }}/>
    </Tab.Navigator>
  )
}

export default Navigation