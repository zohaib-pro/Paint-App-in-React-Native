import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const SideBarComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Animated value for controlling the left position
  const positionX = useSharedValue(0);

  const toggleVisibility = () => {
    // Toggle visibility state
    setIsVisible(!isVisible);

    // Animate the position based on visibility
    positionX.value = withSpring(isVisible ? 0 : -200, {}, (isFinished) => {
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
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleVisibility} style={styles.button}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{isVisible ? '☰' : '❌'}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.animatedView, animatedStyles]}>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton1}>
          <Text>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton2}>
          <Text>Button 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton3}>
          <Text>Button 3</Text>
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
  },
  animatedView: {
    width: 100,
    height: 450,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  menuButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightblue',
  },
});

export default SideBarComponent;
