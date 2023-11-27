import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Icon } from '@rneui/themed';

import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { rootReducer } from './data/Reducer';
import HomeScreen from './screens/HomeScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import EditPostScreen from './screens/EditPostScreen';
import CameraScreen from './screens/CameraScreen';
import LoginScreen from './screens/LoginScreen';
import MyPostsScreen from './screens/MyPostsScreen';
import ChatScreen from './screens/ChatScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), thunk],
});
// const store = configureStore({
//   reducer: rootReducer,
//   // middleware: getDefaultMiddleware(),
// });

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function ExploreTabStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name='PostDetail' component={PostDetailScreen} />
      <Stack.Screen name='EditPost' component={EditPostScreen} />
      <Stack.Screen name='Camera' component={CameraScreen} />
      <Stack.Screen name='Chat' component={ChatScreen}/>
      <Stack.Screen name='ChatDetail' component={ChatDetailScreen}/>
    </Stack.Navigator>
  )
}

function MyPostsTabStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='MyPostsMain' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPostsMain" component={MyPostsScreen} />
    </Stack.Navigator>
  )
}

// function ChatTabStack({ navigation }) {
//   const Tab = createBottomTabNavigator();

//   return (
//     <Tab.Navigator
//       initialRouteName="ChatDetail"
//       screenOptions={{ headerShown: false }}
//     >
//       <Tab.Screen
//         name="ChatDetail"
//         component={ChatDetailScreen}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={ChatScreen}
//       />
//     </Tab.Navigator>
//   );
// }
function ChatStackNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}


function ProfileTabStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='ProfileMain' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

function TabsNavigator() {
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Explore"
        component={ExploreTabStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="home"
                type="ant-design"
                color={color}
                size={size}
              />
            );
          }
        }}
      />
      <Tabs.Screen
        name="My Posts"
        component={MyPostsTabStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="inbox"
                type="ant-design"
                color={color}
                size={size}
              />
            );
          }
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="message1"
                type="ant-design"
                color={color}
                size={size}
              />
            );
          }
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileTabStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="user"
                type="ant-design"
                color={color}
                size={size}
              />
            );
          }
        }}
      />
    </Tabs.Navigator>
  )
}

function AppContainer() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='TabsNavigator' component={TabsNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default AppContainer;