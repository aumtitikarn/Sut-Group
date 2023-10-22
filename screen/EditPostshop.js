import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image, 
    ScrollView, 
    SafeAreaView, 
    StatusBar,
    TextInput,
    TouchableOpacity,camera
} from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from '../firestore'; 
import { getDoc, doc, setDoc, updateDoc, query, collection, where, getDocs, writeBatch } from 'firebase/firestore'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-paper';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SelectDropdown from 'react-native-select-dropdown';


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
const EditPostShop = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const facultyTextRef = useRef(null);
    const [newData, setNewData] = useState({
      name: '', // Default value for name
      prict: '', // Default value for prict
      cate: '', // Default value for cate
    });
    
    const [uid, setUid] = useState('');
    const [photo, setPhoto] = useState('');
    
    const storage = FIREBASE_STORAGE;
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;
    const fetchUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
    
      if (user) {
        const userid = user.uid;
        const userDocRef = doc(FIRESTORE_DB, 'users', userid);
    
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
    
            // ตรงนี้คุณควรเรียก setProfileImg และ setBigImg โดยใช้ข้อมูลจาก Firestore
           
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
    
      }
    };
    
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
const fetchExistingData = async () => {
  try {
      const userUid = auth.currentUser.uid;
      const userDocRef = doc(db, 'PostShop', userUid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
          const existingData = userDoc.data();
          setNewData({
              name: existingData.name || '',
              prict: existingData.prict || '',
              cate: existingData.cate || '',
          });
      }
  } catch (error) {
      console.error('Error fetching existing data:', error.message);
  }
};
useEffect(() => {
  fetchUserData();
  fetchExistingData();
}, []);
  
const handleSaveChanges = async () => {
  try {
    const userUid = auth.currentUser.uid;
    const userDocRef = doc(db, 'PostShop', userUid);

    // สร้างอ็อบเจกต์ที่ใช้เพื่อเก็บข้อมูลที่ควรอัปเดต
    const updatedUserData = {};

    // ตรวจสอบและเพิ่มข้อมูลเฉพาะเมื่อมีค่าใน newData
    if (newData.name) {
      updatedUserData.name = newData.name;
    }
    if (newData.prict) {
      updatedUserData.prict = newData.prict;
    }
    if (newData.cate) {
      updatedUserData.cate = newData.cate;
    }
    if (newData.photo) {
      updatedUserData.photo = newData.photo;
    }

    // ตรวจสอบว่ามีข้อมูลที่ควรอัปเดตหรือไม่
    if (Object.keys(updatedUserData).length > 0) {
      // อัปเดตข้อมูลผู้ใช้
      await updateDoc(userDocRef, updatedUserData);

      // อัปเดตข้อมูลในคอลเลกชัน postHome ของผู้ใช้
      const userPostShopCollectionRef = collection(db, 'allpostShop');
      const userPostShopQuery = query(userPostShopCollectionRef, where('userUid', '==', userUid));

      const userPostShopSnapshot = await getDocs(userPostShopQuery);
      const batch = writeBatch(db);

      userPostShopSnapshot.forEach((doc) => {
        batch.update(doc.ref, updatedUserData);
      });

      await batch.commit();

      alert('Data updated');
      navigation.navigate('Market');
    } else {
      console.error('No valid data to update');
    }
  } catch (error) {
    console.error('Error updating user data:', error.message);
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
        <View style={{ top: -30, left: 100, margin: 5 }}>
            <SelectDropdown
                accessibilityLabel="Choose Service"
                placeholder="ประเภทสินค้า"
                defaultButtonText="ประเภทสินค้า"
                data={type}
                onChangeText={(cate) => setNewData({ ...newData, cate: cate })}
                defaultValue={newData.cate} // Set the defaultValue prop to display the data
            />
        </View>
        <View style={{ top: -30, left: 100, margin: 5 }}>
            <TextInput
                style={styles.input}
                placeholder="ชื่อสินค้า"
                onChangeText={(name) => setNewData({ ...newData, name: name })}
                value={newData.name} // Set the value prop to display the data
            />
        </View>
        <View style={{ top: -30, left: 100, margin: 5 }}>
            <TextInput
                style={styles.input}
                placeholder={`${userData.prict || ''}`}
                onChangeText={(prict) => setNewData({ ...newData, prict: prict })}
                value={newData.prict} // Set the value prop to display the data
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
    
          <Text style={styles.buttonText} onPress={handleSaveChanges} >บันทึก</Text>
    
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
    export default EditPostShop;