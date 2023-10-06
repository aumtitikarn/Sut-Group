import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Button, View,  Modal, Image } from 'react-native';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firebase } from '../firestore';
import 'firebase/auth';

export default function Register({navigation}) {
  const [text, setText] = useState('');
  const [myname, setName] = useState('');
  const [oju, setOju] = useState('');
   const [tt, setTt] = useState('');
  const [my, setMy] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);



  async function UserRegister() {
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log('User registration response:', response);
      const uid = response.user.uid;
      const data = {
         id: uid,
        email: email,
        username: text,
        firstname: myname,
        lastname: oju,
        faculty: tt,
        major: my,
      };
      const usersRef = firebase.firestore().collection('users');
      await usersRef.doc(uid).set(data);
    } catch (error) {
      console.error('Error during user registration:', error);
      setError(error.message);
    }
  }


  return (
    <View style={styles.container}>
     <Image style={styles.logo} source={require('../assets/pro-sut.png')} />
        <Text style={styles.para}>
     ลงทะเบียน
      </Text>
     <View style={styles.vivi}>
     <TextInput
        style={styles.input}
        onChangeText={setText}
        placeholder="ชื่อบัญชีผู้ใช้"
        placeholderTextColor="Gray"
        value={text}
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        placeholder="ชื่อ"
        placeholderTextColor="Gray"
        value={myname}
      />
      <TextInput
        style={styles.input}
        onChangeText={setOju}
        placeholder="นามสกุล"
        placeholderTextColor="Gray"
        value={oju}
      />
      <TextInput
         style={styles.input}
        onChangeText={setTt}
        placeholder="สำนักวิชา"
        placeholderTextColor="Gray"
        value={tt}
      />
      <TextInput
        style={styles.input}
        onChangeText={setMy}
        placeholder="สาขา"
        placeholderTextColor="Gray"
        value={my}
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="อีเมล"
        placeholderTextColor="Gray"
        value={email}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="รหัสผ่าน"
        placeholderTextColor="Gray"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="ยืนยันรหัสผ่าน"
        placeholderTextColor="Gray"
        secureTextEntry
      />
      <Button
          color="black"
          title="Register"
          onPress={() => UserRegister()}
        />
       <Text
        style={styles.register}
        onPress={() => navigation.navigate('Login')}>
        เข้าสู่ระบบ?
      </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create ({
  container: {
    flex:1,
    backgroundColor: '#FFBD59',
    justifyContent: 'center',
    padding: 20,
  
  },
  para:{
    margin: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 1,
  },
  input: {
    height: 40,
    margin: 1,
    borderWidth: 1,
    padding: 10,
   borderRadius: 12,
   backgroundColor: '#FFF',
  },
   register: {
    color: '#FFF',
    marginRight: 30,
    alignSelf: 'flex-end',
  },
   logo: {
    height: 150,
    width: 250,
   marginRight: 10,
    marginLeft: 10,
  },
  vivi:{
    marginTop: 1,
  },
});