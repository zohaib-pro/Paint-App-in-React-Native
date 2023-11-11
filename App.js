// App.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CanvasRender from './CanvasRender'; // Adjust the import path accordingly

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={CanvasRender}
          options={{ drawerLabel: 'Home' }}
        />
        <Drawer.Screen
          name="Option1"
          component={OptionScreen}
          options={{ drawerLabel: 'Save Painting' }}
        />
        <Drawer.Screen
          name="Option2"
          component={OptionScreen}
          options={{ drawerLabel: 'AI Sketch' }}
        />
        <Drawer.Screen
          name="Option3"
          component={OptionScreen}
          options={{ drawerLabel: 'Shape' }}
        />
        {/* Add more drawer options as needed */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function OptionScreen({ route }) {
  // You can access the selected option using route.name
  alert(`Option selected: ${route.name}`);
  return null;
}
