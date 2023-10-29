import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image,TouchableOpacity } from 'react-native';
import { doc, updateDoc, } from 'firebase/firestore';
import { ref, uploadString ,getDownloadURL, uploadBytes, getStorage} from 'firebase/storage';
import { FIRESTORE_DB,FIREBASE_STORAGE  } from '../firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
export default function EditPostShop({ route, navigation }) {
  const { shopId, initialData } = route.params;
  const [newShopData, setNewShopData] = useState(initialData);
  const [photo, setPhoto] = useState(null);
  const storage = FIREBASE_STORAGE;


 
  const handleUpdatePost = async () => {
    try {
      const  id = shopId;
      // อัปโหลดรูปภาพใน Firebase Storage
      const fileName = `${id}.jpg`;
      const storageRef = ref(storage, 'photo_shop/' + fileName);
      const response = await fetch(photo);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
  
      // หลังจากอัปโหลดสำเร็จ รับ URL จาก Storage
      const downloadURL = await getDownloadURL(storageRef);
       // อัปเดตรูปภาพใน newShopData และ Firebase Firestore
      setNewShopData({ ...newShopData, photo: downloadURL });
      await updateDoc(shopRef, { photo: downloadURL, ...newShopData });
      // อัปเดตข้อมูลใน Firestore
      await updateDoc(shopRef, {
        photo: downloadURL,
        name: newShopData.name,
        prict: newShopData.prict,
        phon: newShopData.phon,
        cate: newShopData.cate,
        
        // ... (เพิ่มฟิลด์อื่น ๆ ที่ต้องการอัปเดต)
      });
  
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
      navigation.goBack();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
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
  
    if (!result.cancelled) {
      const newPhotoUri = result.uri;
  
      // อัปเดตรูปภาพใหม่ใน Firebase Storage และ Firestore
      const fileName = `${shopId}.jpg`; // เปลี่ยน id เป็น shopId ที่ได้จาก route.params
      const storageRef = ref(storage, 'photo_shop/' + fileName);
      const response = await fetch(newPhotoUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      // อัปเดตรูปภาพใน newShopData และ Firebase Firestore
      setNewShopData({ ...newShopData, photo: downloadURL });
      setPhoto(newPhotoUri); // อัปเดตรูปภาพใน state เพื่อแสดงใน UI
    }
  };
  

  return (
    <View style={styles.container}>
     <TouchableOpacity>
    <MaterialCommunityIcons 
      name="arrow-left-thick"  
      size={50} style={{margin:10, top: 30}} 
     onPress={() => navigation.goBack()}
      /> 
     </TouchableOpacity>
    <Text style={{textAlign:'center',top:-20,fontSize:20}}>แก้ไขโพสต์</Text>
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
      {newShopData.photo && <Image source={{ uri: newShopData.photo }} style={{ width: 100, height: 100 }} />}
      <TouchableOpacity onPress={Lib}>
                <MaterialCommunityIcons 
                    name="pencil-outline"  
                    size={30}
                    style={{ position: 'absolute', top: -40, left: 80, color: 'black' }}
                />
                </TouchableOpacity>
   
      <Button title="บันทึกการแก้ไข" onPress={handleUpdatePost} />
      </View>
    </View>
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