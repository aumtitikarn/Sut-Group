import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image,TouchableOpacity ,SafeAreaView} from 'react-native';
import { doc, updateDoc,   } from 'firebase/firestore';
import {  ref, uploadBytes,getDownloadURL} from 'firebase/storage';
import { FIRESTORE_DB,FIREBASE_STORAGE ,FIREBASE_AUTH } from '../firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
export default function EditPostShop({ route, navigation }) {
  const { shopId, initialData } = route.params;
  const [newShopData, setNewShopData] = useState(initialData);
  const [photoURL, setPhotoURL] = useState('');
  const storageRef = ref(FIREBASE_STORAGE, `photo_shop/${shopId}`);
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
const storage = FIREBASE_STORAGE;


  const handleSaveChanges = async () => {
    try {
      const userUid = auth.currentUser.uid;
      const userDocRef = doc(db, 'PostShop', userUid);
  
      // สร้างอ็อบเจกต์ที่ใช้เพื่อเก็บข้อมูลที่ควรอัปเดต
      const updatedUserData = {};
  
      // ตรวจสอบและเพิ่มข้อมูลเฉพาะเมื่อมีค่าใน newData
      if (newShopData.name) {
        updatedUserData.name = newShopData.name;
      }
      if (newShopData.prict) {
        updatedUserData.prict = newShopData.prict;
      }
      if (newShopData.cate) {
        updatedUserData.cate = newShopData.cate;
      }if (newShopData.phon) {
        updatedUserData.phon = newShopData.phon;
      }

      if (newShopData.photo) {
        updatedUserData.photo = newShopData.photo;
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
  
  const handleUpdatePost = async () => {
    const shopRef = doc(FIRESTORE_DB, 'allpostShop', shopId);
    
  
    try {
      await updateDoc(shopRef, newShopData);
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
      navigation.goBack();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
    }
  
    if (newShopData.photo !== initialData.photo) {
      // Upload the image to Firebase Storage
      await uploadImage(newShopData.photo);
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
  
      // Update the shop data in Firestore with the new image URL
      await updateDoc(shopRef, { ...newShopData, photo: downloadURL });
      setPhotoURL(downloadURL);
    } else {
      // If no new image was selected, simply update the other shop data in Firestore
      await updateDoc(shopRef, newShopData);
    }
  };
  
  
  const Lib = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('คุณต้องอนุญาตให้เข้าถึงแกลลอรีเพื่อใช้งานฟีเจอร์นี้');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const newPhotoUri = result.uri;
      const id = shopId;
  
      try {
        // สร้างอ้างอิงไปยังไฟล์ใหม่ที่จะอัปโหลด
        const fileName = `${id}.jpg`;
        const storageRef = ref(storage, 'photo_shop/' + fileName);
  
        // ดึงข้อมูลรูปภาพจาก URL
        const response = await fetch(newPhotoUri);
        const blob = await response.blob();
  
        // อัปโหลดรูปภาพไปยัง Firebase Storage
        await uploadBytes(storageRef, blob);
  
        // ดึง URL ของรูปภาพที่อัปโหลดโดยใช้ getDownloadURL จาก storageRef
        const downloadURL = await getDownloadURL(storageRef);
  
        // อัปเดต state และ Firebase Firestore ด้วย URL ของรูปภาพใหม่
        setNewShopData({ ...newShopData, photo: downloadURL });
        setPhotoURL(downloadURL);
        alert('อัปโหลดรูปเรียบร้อย รอหน่อยเดี๋ยวก็ขึ้น')
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ', error);
      }
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
     <TouchableOpacity>
    <MaterialCommunityIcons 
      name="arrow-left"  
      size={40} style={{ top: 30}} 
     onPress={() => navigation.goBack()}
      /> 
     </TouchableOpacity>
    <Text style={{textAlign:'center',fontSize:20}}>แก้ไขโพสต์</Text>
    <View  style={{top:100}}>
      <View  style={{ top: -10, margin: 10 }} >
    <SelectDropdown
  data={type.map(item => ({ value: item, label: item }))}
 
  onSelect={(selectedItem) => {
    setNewShopData({ ...newShopData, cate: selectedItem.value });
  }}
  buttonTextAfterSelection={(selectedItem) => {
    return selectedItem.label;
  }}
  rowTextForSelection={(item) => {
    return item.label;
  }}
  placeholder="ประเภท"
/>
</View>
      <TextInput
        style={styles.input}
        placeholder="ชื่อสินค้า"
        value={newShopData.name}
        onChangeText={(text) => setNewShopData({ ...newShopData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="ราคา"
        value={newShopData.prict}
        onChangeText={(text) => setNewShopData({ ...newShopData, prict: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="ช่องทางติดต่อ"
        value={newShopData.phon}
        onChangeText={(text) => setNewShopData({ ...newShopData, phon: text })}
      />
      <View >
  {photoURL ? (
    <Image source={{ uri: photoURL }} style={{ width: 100, height: 100, marginVertical: 20 }} />
  ) : null}
</View>

      <Button title="บันทึกการแก้ไข" onPress={handleUpdatePost} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'#fff5e2'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
