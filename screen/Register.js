import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, Button, View,  Modal, Image, StatusBar, SafeAreaView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Select,Box,CheckIcon,NativeBaseProvider } from "native-base";


export default function Register({navigation}) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
   const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;



  async function UserRegister() {
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registration response:', response);
      const uid = response.user.uid;
      const data = {
        id: uid,
        email: email,
        username: username,
        firstname: name,
        lastname: lname,
        faculty: faculty,
        major: major,
      };
      // Assuming you have imported and initialized Firestore previously.
      const usersRef = collection(db, 'users');
      await setDoc(doc(usersRef, uid), data);
    } catch (error) {
      console.error('Error during user registration:', error);
      setError(error.message);
    }
  }


  return (
    <NativeBaseProvider>
    <SafeAreaView style={styles.container}>
    <View>
     <Image style={styles.logo} source={require('../assets/2.png')} />
        <Text style={styles.para}>
     ลงทะเบียน
      </Text>
     <View style={styles.vivi}>
     <TextInput
        style={styles.input}
        onChangeText={setUsername}
        placeholder="ชื่อบัญชีผู้ใช้"
        placeholderTextColor="Gray"
        value={username}
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        placeholder="ชื่อ"
        placeholderTextColor="Gray"
        value={name}
      />
      <TextInput
        style={styles.input}
        onChangeText={setLname}
        placeholder="นามสกุล"
        placeholderTextColor="Gray"
        value={lname}
      />
  <Box maxW="300">
        <Select selectedValue={faculty} minWidth="370" accessibilityLabel="Choose Service" placeholder="สำนักวิชา" style={styles.input} _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setFaculty(itemValue)}>
          <Select.Item label="⚗️สำนักวิชาวิทยาศาสตร์" value="⚗️สำนักวิชาวิทยาศาสตร์" />
          <Select.Item label="🧭สำนักวิชาเทคโนโลยีสังคม" value="🧭สำนักวิชาเทคโนโลยีสังคม" />
          <Select.Item label="🌲สำนักวิชาเทคโนโลยีการเกษตร" value="🌲สำนักวิชาเทคโนโลยีการเกษตร" />
          <Select.Item label="⚙️สำนักวิชาวิศวกรรมศาสตร์" value="⚙️สำนักวิชาวิศวกรรมศาสตร์" />
          <Select.Item label="🩺สำนักวิชาแพทย์" value="🩺สำนักวิชาแพทย์" />
          <Select.Item label="💉สำนักวิชาพยาบาลศาสตร์" value="💉สำนักวิชาพยาบาลศาสตร์" />
          <Select.Item label="🦷สำนักวิชาทันตแพทย์" value="🦷สำนักวิชาทันตแพทย์" />
          <Select.Item label="🏥สำนักวิชาสาธารณสุขศาสตร์" value="🏥สำนักวิชาสาธารณสุขศาสตร์" />
          <Select.Item label="💻กลุ่มหลักสูตรศาสตร์และศิลป์ดิจิทัล" value="💻กลุ่มหลักสูตรศาสตร์และศิลป์ดิจิทัล" />
        </Select>
      </Box>
      <TextInput
        style={styles.input}
        onChangeText={setMajor}
        placeholder="สาขา"
        placeholderTextColor="Gray"
        value={major}
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
      <View style={{margin: 10}}>
      <Button
          color="#8AD1DB"
          title="Register"
          onPress={() => UserRegister()}
        />
        </View>
       <Text
        style={styles.register}
        onPress={() => navigation.navigate('Login')}>
        เข้าสู่ระบบ?
      </Text>
      </View>
    </View>
    </SafeAreaView>
    </NativeBaseProvider>
  );
}
const styles = StyleSheet.create ({
  container: {
    flex:1,
    backgroundColor: '#FDF4E2',
    justifyContent: 'center',
    padding: 20,
    paddingTop: StatusBar.currentHeight
  
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
    color: '#1C1441',
    marginRight: 30,
    alignSelf: 'flex-end',
  },
   logo: {
    height: 150,
    width: 250,
    marginLeft: 50,
  },
  vivi:{
    marginTop: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
  },
}); 