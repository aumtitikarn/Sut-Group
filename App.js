import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screen/Home';
import Marketplace from './screen/Market';
import Chat from './screen/Chat';
import Profile from './screen/Profile';
import Login from './screen/Login';
import Register from './screen/Register';
import Createpost from './screen/createpost'
import NotiScreen from './screen/notiscreen'
import Marketpost from './screen/marketpost'
//commenttttt
const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator barStyle={styles.tabbarStyle}
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
        screenOptions={{
          headerShown: false,
        }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={Marketplace}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="basket" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Page() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Createpost" component={Createpost} />
        <Stack.Screen name="NotiScreen" component={NotiScreen} />
        <Stack.Screen name="Marketpost" component={Marketpost} />
        <Stack.Screen name="MyTabs" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}
const styles = StyleSheet.create({
  tabbarStyle: {
    backgroundColor: '#FFBD59',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    //marginTop: -60,
    shadowOffset: {
      width: 10,
      height: 30,
    },
    shadowOpacity: 0.58,
    shadowRadius: 60.0,
    elevation: 10,
  },
}); 

