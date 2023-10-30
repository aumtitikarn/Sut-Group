import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Button, View, Image,SafeAreaView, StatusBar } from 'react-native';
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
      navigation.navigate('MyTabs');
    } catch (error) {
      if (error.code === 'auth/invalid-login-credentials') {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } 
    }
  }

  useEffect(() => {
    // Check authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
          if (user) {
            // ผู้ใช้ล็อกอินอยู่
            console.log("User is logged in:", user);
      
          } else {
            // ผู้ใช้ไม่ได้ล็อกอิน
            console.log("User is not logged in");
          }
        });
        navigation.navigate('MyTabs');
      }
    });
    return () => unsubscribe();
  }, [navigation, auth]);
 


  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Image style={styles.logo} source={require('../assets/2.png')}  />
      <Text style={styles.logostyle}>เข้าสู่ระบบ</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="อีเมล "
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
      <Text
        style={{color: '#1C1441', left:40}}
        onPress={() => navigation.navigate('Forgot')}>
        ลืมรหัสผ่าน?
      </Text>
      <View style={styles.loginButton}>
        <Button color="#8AD1DB" title="เข้าสู่ระบบ" onPress={() => UserLogin()} />
      </View>
      <Text
        style={styles.register}
        onPress={() => navigation.navigate('Register')}>
        สมัครสมาชิก?
      </Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FDF4E2',
    paddingTop: StatusBar.currentHeight //เว้นระยะส่วนบนขอ Andriod
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
    color: '#1C1441',
    marginRight: 30,
    alignSelf: 'flex-end',
  },
  logo: {
    height: 150,
    width: 320,
    marginLeft: 50
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  }
});