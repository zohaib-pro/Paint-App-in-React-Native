// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import CanvasRender from './screens/CanvasRender';

import { firebase } from './config';

const Stack = createStackNavigator();

const App = () => {

  const temp = true;
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          temp?
          <>
            <Stack.Screen name="Canvas" component={CanvasRender} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </> 
          :
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Canvas" component={CanvasRender} />
          </>
        }
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
