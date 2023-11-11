// App.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CanvasRender from './CanvasRender'; // Adjust the import path accordingly

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="DrawGen">
        <Drawer.Screen
          name="DrawGen"
          component={CanvasRender}
          options={{ drawerLabel: 'DrawGen' }}
        />
        <Drawer.Screen
          name="Save Painting"
          component={CanvasRender}
          options={{ drawerLabel: 'Save Painting' }}
        />
        <Drawer.Screen
          name="AI Sketch"
          component={CanvasRender}
          options={{ drawerLabel: 'AI Sketch' }}
        />
        <Drawer.Screen
          name="Shape"
          component={CanvasRender}
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
