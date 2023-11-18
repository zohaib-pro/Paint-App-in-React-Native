import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
=======
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
>>>>>>> forked-repo/main
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

<<<<<<< HEAD
const SideBarComponent = ({onclear}) => {
=======
import { firebase } from './config';
const auth = firebase.auth();
const firestore = firebase.firestore();

const SideBarComponent = ({navigation}) => {

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


>>>>>>> forked-repo/main
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
<<<<<<< HEAD
        <TouchableOpacity style={styles.menuButton} onPress={onclear}>
          <Text>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton1}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton3}>
          <Text>soon</Text>
=======
        <Image
          style={styles.logo}
          source={require('./assets/genDrawLogo.jpeg')}
        />
        <Text style={styles.welcomeText}>Hi, {userName} 👋</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton1}>
          <Text>   Clear   </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton2}>
          <Text>   Save   </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleButton3}>
          <Text>AI Sketch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#e74c3c', marginTop: 100 }] } onPress={handleLogout}>
          <Text>Logout</Text>
>>>>>>> forked-repo/main
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
<<<<<<< HEAD
    backgroundColor: 'lightgray'
  },

=======
    backgroundColor: '#eaf2ff',
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    color: '#fff',
  },
>>>>>>> forked-repo/main
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
