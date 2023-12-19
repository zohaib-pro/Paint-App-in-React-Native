import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';

import {getFirestore} from 'firebase/firestore'
import FirebaseHelper from '../utils/FirebaseHelper';

//const auth = firebase.auth();
const firestore = getFirestore();

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setCofirmPass] = useState('');
  const [isLoading, setLoading] = useState(false)


  const firebaseHelper = new FirebaseHelper()
  const handleSignUp = async () => {
    try {
      setLoading(true)
      await firebaseHelper.signUp(email, password, name)

      Alert.alert('Success', 'Account created successfully. Please verify your email.');
      setLoading(false)
      navigation.navigate('Login');
    } catch (error) {
      setLoading(false)
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign up Today and Start using</Text>
        <Text style={styles.logoText}>GenDrawing</Text>
      </View>
      <Image
        style={styles.logo}
        source={require('../assets/genDrawLogo.png')}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={[styles.button, styles.horizontal, styles.center, { backgroundColor: '#2ecc71' }]}
        onPress={handleSignUp}
      >
        {isLoading && <ActivityIndicator color={"white"} />}
        {isLoading && <Text>{"  "}</Text>}
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eaf2ff',
  },

  horizontal:{
    flexDirection: 'row'
  },

  center:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  logo: {
    width: 220,
    height: 220,
    marginVertical: 10,
  },
});

export default SignUpScreen;
