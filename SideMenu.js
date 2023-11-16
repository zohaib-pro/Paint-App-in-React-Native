import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const SideBarComponent = ({onclear}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animated value for controlling the left position
  const positionX = useSharedValue(0);

  useEffect(()=>{
    toggleVisibility();
  }, [])

  const toggleVisibility = () => {
    // Toggle visibility state
    setIsVisible(!isVisible);

    // Animate the position based on visibility
    positionX.value = withSpring(isVisible ? 0 : -500, {}, (isFinished) => {
      // You can add additional logic here if needed
    });
  };

  // Define the animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionX.value }],
    };
  });

  const handleButton1 = () => {
    // Functionality for Button 1
    Alert.alert('Button 1 Pressed', 'Perform Button 1 Action');
  };

  const handleButton2 = () => {
    // Functionality for Button 2
    Alert.alert('Button 2 Pressed', 'Perform Button 2 Action');
  };

  const handleButton3 = () => {
    // Functionality for Button 3
    Alert.alert('Button 3 Pressed', 'Perform Button 3 Action');
  };

  return (
    <View >
      <TouchableOpacity onPress={toggleVisibility} style={styles.button}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{isVisible ? '☰' : '❌'}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.animatedView, animatedStyles]}>
        <TouchableOpacity style={styles.menuButton} onPress={onclear}>
          <Text>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton1}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton3}>
          <Text>soon</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 25,
    backgroundColor: 'pink'
  },
  animatedView: {
    position:'absolute',
    top: 100,
    width: 100,
    height: 450,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray'
  },

  menuButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightblue',
  },
});

export default SideBarComponent;
