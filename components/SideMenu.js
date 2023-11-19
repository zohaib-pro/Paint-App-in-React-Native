import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { firebase } from '../config';
const SideBarComponent = ({navigation, onclear, onsave}) => {

const auth = firebase.auth();
const firestore = firebase.firestore();
  /*  */
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          if (userData) {
            const { firstName, lastName } = userData;
            setUserName(`${firstName} ${lastName}`);
          }
        }
      } catch (error) {
        console.error('Error fetching user information:', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error(error.message);
    }
  };
  /*  */


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

  return (
    <View >
      <TouchableOpacity onPress={toggleVisibility} style={styles.button}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{isVisible ? '☰' : '❌'}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.animatedView, animatedStyles]}>
        <Image
          style={styles.logo}
          source={require('../assets/genDrawLogo.jpeg')}
        />
        <Text style={styles.welcomeText}>Hi, {userName} 👋</Text>
        <TouchableOpacity style={styles.menuButton} onPress={onclear}>
          <Text>   Clear   </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={onsave}>
          <Text>   Save   </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={()=>{alert('comming soon!')}}>
          <Text>AI Sketch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#e74c3c', marginTop: 100 }] } onPress={handleLogout}>
          <Text>Logout</Text>
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
    backgroundColor: '#eaf2ff',
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
  },
});

export default SideBarComponent;
