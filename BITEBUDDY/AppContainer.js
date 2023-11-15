import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Icon } from '@rneui/themed';

import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './data/Reducer';
import HomeScreen from './screens/HomeScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import EditPostScreen from './screens/EditPostScreen';

const store = configureStore({
  reducer: rootReducer, 
});

function ExploreTabStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name='PostDetail' component={PostDetailScreen}/>
            <Stack.Screen name='EditPost' component={EditPostScreen}/>
        </Stack.Navigator>
    )
}

function AppContainer() {

  const Tabs = createBottomTabNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tabs.Navigator screenOptions={{ headerShown: false}}>
          <Tabs.Screen
            name="Explore"
            component={ExploreTabStack}
            options={{
              tabBarIcon: ({focused, color, size}) => {
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
        </Tabs.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default AppContainer;