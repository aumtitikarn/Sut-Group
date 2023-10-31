import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screen/Home';
import Marketplace from './screen/Market';
import ChatHomeScreen from './screen/ChatHomeScreen';
import AddToChat from './screen/AddToChat';
import ChatScreen from './screen/ChatScreen';
import Profile from './screen/Profile';
import Login from './screen/Login';
import Register from './screen/Register';
import Createpost from './screen/createpost';
import Marketpost from './screen/marketpost';
import EditProfile from './screen/EditProfile';
import EditPostHome from './screen/EditPostHome';
import Forgot from './screen/Forgot';
import EditPostShop from './screen/EditPostshop';
import Comment from './screen/comment';
import PostHome from './components/PostHome';
import Reply from './screen/Reply';
import BasketGame from './screen/basketGame';
import AddScore from './components/AddScore';
import Rank from './components/rank';
import { Provider } from 'react-redux';
import Store from './context/store'; 
import Info from './screen/Info'; 


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function MyTabs() {
  return (
    <Provider store={Store}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#1C1441',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FDF4E2',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            width: '100%',
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 17, // ปรับขนาดตัวอักษรตรงนี้
            top: -7
          },

        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'หน้าหลัก',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={30} />
            ),
          }}
        />

        <Tab.Screen
          name="ChatHomeScreen"
          component={ChatHomeScreen}
          options={{
            tabBarLabel: 'แชท',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chat" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Marketplace"
          component={Marketplace}
          options={{
            tabBarLabel: 'ร้านค้า',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="basket" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Rank"
          component={Rank}
          options={{
            tabBarLabel: 'เกม',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="basketball" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'โปรไฟล์',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    </Provider>
  );
}

export default function Page() {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Forgot" component={Forgot} />
          <Stack.Screen name="ChatHomeScreen" component={ChatHomeScreen} />
          <Stack.Screen name="AddToChat" component={AddToChat} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="Createpost" component={Createpost} />
          <Stack.Screen name="Marketpost" component={Marketpost} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="EditPostShop" component={EditPostShop} />
          <Stack.Screen name="EditPostHome" component={EditPostHome} />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="MyTabs" component={MyTabs} />
          <Stack.Screen name="Reply" component={Reply} />
          <Stack.Screen name="AddScore" component={AddScore} />
          <Stack.Screen name="Info" component={Info} />
          <Stack.Screen name="BasketGame" component={BasketGame} />
          <Stack.Screen name="Marketplace" component={Marketplace} />
          <Stack.Screen name="Rank" component={Rank} />
          <Stack.Screen name="PostHome" component={PostHome} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );

}