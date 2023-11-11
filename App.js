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
          component={() => <CanvasRender customFunction={drawGenFunction} />}
          options={{ drawerLabel: 'DrawGen' }}
        />
        <Drawer.Screen
          name="Save Painting"
          component={() => <CanvasRender customFunction={savePaintingFunction} />}
          options={{ drawerLabel: 'Save Painting' }}
        />
        <Drawer.Screen
          name="AI Sketch"
          component={() => <CanvasRender customFunction={aiSketchFunction} />}
          options={{ drawerLabel: 'AI Sketch' }}
        />
        <Drawer.Screen
          name="Shape"
          component={() => <CanvasRender customFunction={shapeFunction} />}
          options={{ drawerLabel: 'Shape' }}
        />
        {/* Add more drawer options as needed */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Define your custom functions for the options
function drawGenFunction() {
  // Add your custom logic here
  alert('Custom function for DrawGen option');
}

function savePaintingFunction() {
  // Add your custom logic here
  alert('Custom function for Save Painting option');
}

function aiSketchFunction() {
  // Add your custom logic here
  alert('Custom function for AI Sketch option');
}

// Define your custom function for the "Shape" option
function shapeFunction() {
  // Add your custom logic here
  alert('Custom function for Shape option');
}