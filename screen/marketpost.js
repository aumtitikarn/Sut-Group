import { View, Text,  SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Love () {
  
const navigation = useNavigation();

  const handleMarketPress = () => {
    navigation.navigate('Market');
  };

  const [dname, setDname] = useState('');
  const [tname, setTname] = useState('');
  const [pri, setPri] = useState('');

async function Shoppost() {
    
    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log('User registration response:', response);
      const uid = response.shop.uid;
      const data = {
         id: uid,
        name: dname,
        cate: tname,
        prict: pri,
       
      };
      const usersRef = firebase.firestore().collection('shop');
      await usersRef.doc(uid).set(data);
    } catch (error) {
      console.error('Error during user registration:', error);
      setError(error.message);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
    <View>
    <MaterialCommunityIcons 
      name="arrow-left-thick"  
      size={50} style={{margin:10}} 
     onPress={() => navigation.goBack()}
      />
    </View>
      <View
   style={{
      top: 10,
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={50} />
    </View>
     <View
   style={{
     top: -30,
      left: 100, 
       margin: 5
    }}>
      <TextInput
        style={styles.input}
        placeholder="ประเภท เช่น คอม ผัก ผลไม้.."
        placeholderTextColor="Gray"
        textAlignVertical="top" // Align text to the top
        multiline={true}
        onChangeText={setDname}
        value={dname}
      />
    </View>
      <View
   style={{
     top: -30,
      left: 100, 
       margin: 5
    }}>
      <TextInput
        style={styles.input}
        placeholder="ชื่อสินค้า"
        placeholderTextColor="Gray"
        textAlignVertical="top" // Align text to the top
        multiline={true}
        onChangeText={setTname}
        value={tname}
      />
    </View>
      <View
   style={{
     top: -30,
      left: 100, 
       margin: 5
    }}>
      <TextInput
        style={styles.input}
        placeholder="ราคา"
        placeholderTextColor="Gray"
        textAlignVertical="top" // Align text to the top
        multiline={true}
        onChangeText={setPri}
        value={pri}
      />
    </View>
    <View style={styles.iconContainer}>
    <Icon name="camera" size={20} color="#000" style={styles.icon} />
    <Icon name="image" size={20} color="#000" style={styles.icon} />
     <Icon name="map" size={20} color="#000" style={styles.icon} />
    <Icon  name="paperclip" size={20} color="#000" style={styles.icon} />
    <Icon  name="awesome" size={20} color="#000" style={styles.icon} />
    
    </View>
    <View style={{
      top: -40,
      left: 275
    }}>
    
    <TouchableOpacity style={styles.buttonYellow}>
      <Text style={styles.buttonText} onPress={() => Shoppost()} >โพสต์</Text>
    </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
  },
   input: {
    height: 50,
    width: 275,
    borderWidth: 1,
    borderRadius:10,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  iconContainer: {
    flexDirection: 'row', // จัดเรียงแนวนอน
    alignItems: 'center', // จัดวางไอคอนให้ตรงกลาง
    top:-20,
    marginLeft: 105
  },
  icon: {
    marginRight: 10, // ระยะห่างระหว่างไอคอน
  },
   buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 70,
    padding:5,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    margin: 5
  },
});

