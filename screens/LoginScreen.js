import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Database from '../utils/Database';
import FirebaseHelper from '../utils/FirebaseHelper';





const LoginScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  Database.getSignedInUser(userInfo => {
    if (userInfo) {
      navigation.replace('Main', userInfo)
    }
  });

  const firebaseHelper = new FirebaseHelper()
  const handleLogin = async () => {
    try {
      setLoading(true)
      const user = await firebaseHelper.signIn(email, password)
      const userInfo = await firebaseHelper.getItem('users', user.uid)
      userInfo.uid = user.uid
      await Database.signinUser(userInfo);
      const item = await firebaseHelper.getItem('drawings', user.uid)
      //save drawings in local database
      if (item)
        await Database.saveDrawings(item.drawings)
      setLoading(false)
      navigation.navigate('Main', userInfo);
    } catch (error) {
      setLoading(false)
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/genDrawLogo.png')}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign in Today and Start using</Text>
        <Text style={styles.logoText}>GenDrawing</Text>
      </View>
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
      <TouchableOpacity
        style={[styles.button, {flexDirection: 'row', justifyContent: 'center'}, { backgroundColor: '#3498db', marginTop: 30 }]}
        onPress={handleLogin}
      >
        {isLoading && <ActivityIndicator color={"white"} />}
        {isLoading && <Text>{"  "}</Text>}
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2ecc71', marginTop: 10 }]}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eaf2ff',
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
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  logo: {
    width: 220,
    height: 220,
    marginVertical: 50,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});

export default LoginScreen;
