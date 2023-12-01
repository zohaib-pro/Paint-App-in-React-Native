import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { firebase } from '../config';

/**
 * 
 * @param {*} param0 an object containing navigation and a btnList
 * the list format should be [{text, onPress}, ...]
 * @returns 
 */
const SideBarComponent = ({ navigation, username, btnList=[], onOpen, onClose, style }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animated value for controlling the left position
  const positionX = useSharedValue(0);

  useEffect(() => {
    toggleVisibility();
  }, [])

  const toggleVisibility = () => {
    // Toggle visibility state
    setIsVisible(!isVisible);
    
    if (isVisible && onOpen)
      onOpen();
    else if (onClose)
      onClose();

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

  return (
    <View style={style}>
      <TouchableOpacity onPress={toggleVisibility} style={styles.button}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{isVisible ? '☰' : '❌'}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.animatedView, styles.cardShadow,  animatedStyles]}>
        <Image
          style={styles.logo}
          source={require('../assets/genDrawLogo.png')}
        />
        <Text style={styles.welcomeText}>Hi, {username} 👋</Text>
        {
          btnList.map((btn, index) => ( // Added the arrow function parentheses
            <TouchableOpacity key={index} style={styles.menuButton} onPress={btn.onPress}>
              <Text style={styles.btnText}>{btn.text}</Text> 
            </TouchableOpacity>
          ))
        }
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    margin: 25,
    backgroundColor: 'pink',
    flexWrap: 'wrap'
  },
  animatedView: {
    position: 'absolute',
    top: 100,
    width: 100,
    height: 450,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#eaf2ff',
    overflow: 'scroll',
    
  },

  button: {
    borderRadius: 5,
    color: '#fff',
  },
  menuButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightblue',
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  btnText: {
    textAlign:'center'
  }, 
  
  cardShadow: {
    shadowOffset: { width: -12, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 50,
    shadowColor: '#171717'
},
});

export default SideBarComponent;
