import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Button, View, Image,} from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firestore';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');
  const auth = FIREBASE_AUTH;

  async function UserLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert('เข้าสู่ระบบสำเร็จ');
      navigation.navigate('MyTabs');
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }
  }

  useEffect(() => {
    // Check authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('MyTabs');
      }
    });
    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, [navigation, auth]);


  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/pro-sut.png')}  />
      <Text style={styles.logostyle}>เข้าสู่ระบบ</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email "
        placeholderTextColor="Gray"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="รหัสผ่าน"
        secureTextEntry={hidePassword}
        placeholderTextColor="Gray"
      />
      <View style={styles.loginButton}>
        <Button color="#000001" title="Login" onPress={() => UserLogin()} />
      </View>
      <Text
        style={styles.register}
        onPress={() => navigation.navigate('Register')}>
        สมัครสมาชิก?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFBD59',
  },
  logostyle: {
    marginTop: 2,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 30,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 12,
    padding: 10,
    marginRight: 30,
    marginLeft: 30,
  },
  loginButton: {
    marginTop: 12,
    marginRight: 30,
    marginLeft: 30,
    
  },
  register: {
    color: '#FFF',
    marginRight: 30,
    alignSelf: 'flex-end',
  },
  logo: {
    height: 150,
    width: 320,
    marginLeft: 30
  },
});