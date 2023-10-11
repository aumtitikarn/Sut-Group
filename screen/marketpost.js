import { View, Text,  SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import {Icon} from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDoc,
  collection,
  
  } from 'firebase/firestore';

export default function Marketpost() {

  const [dname, setDname] = useState('');
  const [tname, setTname] = useState('');
  const [pri, setPri] = useState('');
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;

const navigation = useNavigation();

  const handleMarketPress = async () => {//แก้tryทั้งหมด

    try {
    const shopRef = await addDoc(collection(db, 'post'),{
        name: dname,
        cate: tname,
        prict: pri,
    });
    console.log('Document written with ID: ', shopRef.id);
        setFeed('');
        setPhoto(null); 
      navigation.navigate('Market');
    }
      catch (error) {
        console.error('Error adding document: ', error);
    }
   
  };
//เข้าถึงกล้อง
const camera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [10, 10],
    quality: 1,
  });

if (!result.canceled) {
  setPhoto(result.assets[0].uri);
}
};

// เข้าถึงคลังรูปภาพ
const openlib = async () => {
let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.All,
  allowsEditing: true,
  aspect: [10, 10],
  quality: 1,
});

console.log(result);

if (!result.canceled) {
  setPhoto(result.assets[0].uri);
}
};


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
    <Icon name="camera" type="antdesign"  size={20} color="#000" style={styles.icon} />
    <Icon name="image"  size={20} color="#000" style={styles.icon} />
     <Icon name="enviromento" type="antdesign" size={20} color="#000" style={styles.icon} />
    <Icon  name="paperclip" type="antdesign" size={20} color="#000" style={styles.icon} />
    <Icon  name="emoji-happy" type="entypo" size={20} color="#000" style={styles.icon} />
    
    </View>
    <View style={{
      top: -40,
      left: 275
    }}>
    
    <TouchableOpacity style={styles.buttonYellow}>

      <Text style={styles.buttonText} onPress={handleMarketPress} >โพสต์</Text>

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

