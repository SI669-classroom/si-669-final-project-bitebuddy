import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './data/Reducer';
import HomeScreen from './screens/HomeScreen';
import PostDetailScreen from './screens/PostDetail';
import { loadItems } from './data/Actions';

const store = configureStore({
  reducer: rootReducer, 
});

const Stack = createNativeStackNavigator();

function Nav() {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
            initialRouteName='Home' 
            screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home' component={HomeScreen}/>
          <Stack.Screen name='Details' component={PostDetailScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default Nav;