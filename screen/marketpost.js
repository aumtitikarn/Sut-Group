import { View, Text,  SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDoc,
  collection,
  serverTimestamp,doc,
  getDoc
  } from 'firebase/firestore';
import {FIRESTORE_DB,FIREBASE_STORAGE} from '../firestore';
import { FIREBASE_AUTH } from '../firestore';



export default function Marketpost() {

  const [dname, setDname] = useState('');
  const [tname, setTname] = useState('');
  const [pri, setPri] = useState('');
  const [faculty,setFaculty] = useState('');
  const [username,setUsername]= useState('');
  const [photo, setPhoto]= useState('');
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;
  const auth = FIREBASE_AUTH;

const navigation = useNavigation();
useEffect(() => {
  const userUid = auth.currentUser?.uid;
  if (userUid) {
    const userCollectionRef = collection(db, 'users');
    const userDocRef = doc(userCollectionRef, userUid);

    getDoc(userDocRef)
      .then((userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User Data:', userData);
          setUsername(userData.username);
          setFaculty(userData.faculty);
          console.log('Name:', username);
      console.log('Faculty:', faculty);
        } else {
          console.error('User document does not exist.');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data: ', error);
      });
  }
}, [auth.currentUser]);

  const handleMarket = async () => {

    try {
      const userUid = auth.currentUser.uid;
      if (userUid) {
        const postShopCollectionRef = collection(db, 'users', userUid, 'postShop');
        const newCollectionName = 'allpostShop';
        const allpostShopCollectionRef = collection(db, newCollectionName);
    const shop ={
        name: dname,
        cate: tname,
        prict: pri,
        timestamp: serverTimestamp(),
        userUid: userUid
    };
    await addDoc(postShopCollectionRef, shop);
    await addDoc(allpostShopCollectionRef, shop);
    
     console.log('Document written with ID: ', userUid);
    navigation.navigate('Marketplace');
        setPhoto(null); 
      }
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
      size={50} style={{margin:10, top: 20}} 
     onPress={() => navigation.goBack()}
      />
    </View>
      <View
   style={{
      top: 20,
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
        value={tname}
        onChangeText={setTname}
        
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
        value={dname}
        onChangeText={setDname}
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
        value={pri}
        onChangeText={setPri}
      />
    </View>
    {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 110,top: -50, margin: 10 }} />}
    <View style={styles.iconContainer}>
    <MaterialCommunityIcons name="camera" size={20}   color="#000" style={styles.icon} onPress={camera}/>
    <MaterialCommunityIcons name="image" size={20}   color="#000" style={styles.icon} onPress={openlib}/>
    </View>
    <View style={{
      top: -40,
      left: 275
    }}>
    
    <TouchableOpacity style={styles.buttonYellow}>

      <Text style={styles.buttonText} onPress={handleMarket} >โพสต์</Text>

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

