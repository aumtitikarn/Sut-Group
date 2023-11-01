import { View, Text,  SafeAreaView, StyleSheet, TextInput, TouchableOpacity,  Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Avatar } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDoc,
  collection,
  serverTimestamp,doc,
  getDoc,setDoc
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {FIRESTORE_DB,FIREBASE_STORAGE} from '../firestore';
import { FIREBASE_AUTH } from '../firestore';
import * as ImagePicker from 'expo-image-picker';
import { Select,Box,CheckIcon,NativeBaseProvider } from "native-base";


export default function Marketpost() {
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [dname, setDname] = useState('');
  const [tname, setTname] = useState('');
  const [pri, setPri] = useState('');
  const [phon, setPhon] = useState('');
  const [faculty,setFaculty] = useState('');
  const [username,setUsername]= useState('');
  const [photo, setPhoto] = useState(null);
  const [profileImg, setProfileImg] = useState(''); 
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;
  const auth = FIREBASE_AUTH;

  const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]

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
          setProfileImg(userData.profileImg);
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
       // สร้างค่า id สำหรับเอกสาร (เช่นตามเวลาปัจจุบัน)
       const id = Date.now().toString(); // หรือวิธีอื่น ๆ ที่คุณต้องการ
      const postShopCollectionRef = collection(db, 'users', userUid, 'postShop');
      const shop = {
        username: username,
        faculty: faculty,
        name: dname, // ชื่อสินค้า
        cate: tname, // ประเภทสินค้าที่ผู้ใช้เลือก
        prict: pri, // ราคาสินค้า
        phon:phon,
        timestamp: serverTimestamp(),
        profileImg: profileImg,
        userUid: userUid,
        shopid: id,
        like: 0
      };
      if (photo) {
        const fileName = `${id}.jpg`;
        const storageRef = ref(storage, 'photo_shop/' + fileName);
        
        // Convert the local file URI to Blob
        const response = await fetch(photo);
        const blob = await response.blob();

        // Upload the image to Firebase Storage
        await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Add the download URL to the shop object
        shop.photo = downloadURL;
      }
      const allpostShopCollectionRef = collection(db, 'allpostShop');
      // Upload the shop object data to Firestore
      await setDoc(doc(allpostShopCollectionRef, id), shop);
      await setDoc(doc(postShopCollectionRef, id), shop);
      
      // Navigate to the desired screen after successful upload
      navigation.navigate('Marketplace ');

      // Clear the selected photo after uploading
      setPhoto(null);
    }
    if (!photo) {
      Alert.alert('แจ้งเตือน', 'กรุณาเลือกรูปภาพสินค้า');
      return;
    }
    // ... (your existing code)
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

  
  // เข้าถึงกล้อง

  const camera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });
  
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setIsPhotoSelected(true);
    }
  };
  
  const openlib = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });
  
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setIsPhotoSelected(true);
    }
  };
///  


  return (
    <NativeBaseProvider>
    <SafeAreaView style={styles.container}>
    <TouchableOpacity>
    <MaterialCommunityIcons 
      name="arrow-left-thick"  
      size={50} style={{margin:10, top: 20}} 
     onPress={() => navigation.goBack()}
      />
    </TouchableOpacity>
      <View
   style={{
      top: 25, 
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={60} style={{  backgroundColor:'orange'}} color={'#FFF'} />
            <Image
              source={{ uri: profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 60, height:60}}
            /> 
    </View>
     <View  style={{
            top: -30,
            left: 100,
            margin: 5,
            width: 216,
            borderRadius: 5,
            borderWidth: 1,
          }}
>
     <SelectDropdown
            selectedValue={tname}
            accessibilityLabel="Choose Service"
            placeholder="ประเภทสินค้า"
            defaultButtonText="ประเภทสินค้า"
            data={type}
            onSelect={(selectedItem) => setTname(selectedItem)}
            
            buttonTextAfterSelection={(selectedItem) => {
             
              return selectedItem;
            }}
            rowTextForSelection={(product) => {
              return product;
            
            }}
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
    <View
   style={{
     top: -30,
      left: 100, 
       margin: 5
    }}>
      <TextInput
        style={styles.input}
        placeholder="ช่องทางการติดต่อ"
        placeholderTextColor="Gray"
        textAlignVertical="top" // Align text to the top
        multiline={true}
        value={phon}
        onChangeText={setPhon}
      />
    </View>
    {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 150,top: -30, margin: 10 }} />}
    <View style={styles.iconContainer}>
    <MaterialCommunityIcons name="camera" size={20}   color="#000" style={styles.icon} onPress={camera}/>
    <MaterialCommunityIcons name="image" size={20}   color="#000" style={styles.icon} onPress={openlib}/>
    </View>
    <View style={{
      top: -40,
      left: 275
    }}>
    
    <TouchableOpacity
  style={{
    ...styles.buttonYellow,
    backgroundColor: isPhotoSelected ? '#FDF4E2' : '#C0C0C0',
  }}
  onPress={handleMarket}
  disabled={!isPhotoSelected} // Disable the button when no photo is selected
>
  <Text style={styles.buttonText}>โพสต์</Text>
</TouchableOpacity>
    </View>
    </SafeAreaView>
    </NativeBaseProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8AD1DB',
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
    backgroundColor: '#FFF'
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
    backgroundColor: '#FDF4E2',
    width: 70,
    padding:5,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    margin: 5
  },
});

