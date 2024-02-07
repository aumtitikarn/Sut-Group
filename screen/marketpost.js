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
        userUid: userUid,
        shopid: id,
        like: 0
      };

      if (profileImg) {
        shop.profileImg = profileImg;
      }
      
      if (photo) {
        // แก้ไขชื่อรูปภาพให้เป็น id ของโพสต์
        const fileName = `${id}.jpg`;
      
        // อัปโหลดรูปภาพไปยัง Firebase Storage
        const storageRef = ref(storage, 'photo_shop/' + fileName); // ต้องใช้ ref() แทน storage.ref()
      
        const response = await fetch(photo);
        const blob = await response.blob();
      
        await uploadBytes(storageRef, blob);
      
        // อัปเดตค่า 'photo' ด้วย URI ที่อ้างอิงจาก Firebase Storage
        const downloadURL = await getDownloadURL(storageRef);
        shop.photo = downloadURL;
      }
      
      const allpostShopCollectionRef = collection(db, 'allpostShop');
      // Upload the shop object data to Firestore
      await setDoc(doc(allpostShopCollectionRef, id), shop);
      await setDoc(doc(postShopCollectionRef, id), shop);
      
      // Navigate to the desired screen after successful upload
      navigation.goBack();
      console.log('Document written with ID: ', id);
     
      setPhoto(null);
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
    <NativeBaseProvider>
    <SafeAreaView style={styles.container}>
   
    <MaterialCommunityIcons 
     name="arrow-left"  
     size={45} style={{margin:10 ,top:80}} 
     onPress={() => navigation.goBack()}
      />
 
    <View style={{
     top: 80,}}>
      <View
   style={{
      top: 30, 
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={60} style={{  backgroundColor:'#1C1441'}} color={'#FFF'} />
            <Image
              source={{ uri: profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 60, height:60}}
            /> 
    </View>
     <View  style={{
            top: -30,
            left: 100,
            margin: 5,
            width: 209,
            borderRadius: 5,
            borderWidth: 1,
          }}>
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
    <MaterialCommunityIcons name="camera" size={30}   color="#000" style={styles.icon} onPress={camera}/>
    <MaterialCommunityIcons name="image" size={30}   color="#000" style={styles.icon} onPress={openlib}/>
    </View>
    <View style={{
      top: -40,
      left: 275
    }}>
    
    <TouchableOpacity
  style={styles.buttonYellow }
  onPress={handleMarket}
 // Disable the button when no photo is selected
>
  <Text style={styles.buttonText}>โพสต์</Text>
</TouchableOpacity>
    </View>
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
    borderRadius: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // ลองปรับ shadowOpacity
    backgroundColor: '#FFF'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -15, // ลองปรับ top
    marginLeft: 105
  },
  icon: {
    marginRight: 10,
  },
  buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FDF4E2',
    width: 70,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // ลองปรับ shadowOpacity
  },
});

