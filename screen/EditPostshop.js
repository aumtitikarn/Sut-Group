import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image,TouchableOpacity } from 'react-native';
import { doc, updateDoc, getDownloadURL,  } from 'firebase/firestore';
import {  ref, uploadBytes, DownloadURL } from 'firebase/storage';
import { FIRESTORE_DB,FIREBASE_STORAGE  } from '../firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
export default function EditPostShop({ route, navigation }) {
  const { shopId, initialData } = route.params;
  const [newShopData, setNewShopData] = useState(initialData);
  const [photoURL, setPhotoURL] = useState('');
  const storageRef = ref(FIREBASE_STORAGE, `shopPhotos/${shopId}`);
 

 useEffect(() => {
    openlib();
  }, []); 
  
  const handleUpdatePost = async () => {
    const shopRef = doc(FIRESTORE_DB, 'allpostShop', shopId);
  
    try {
      await updateDoc(shopRef, newShopData);
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
      navigation.goBack();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
    }
  
    // If a new image was selected, upload and update the image URL
    if (newShopData.photo !== initialData.photo) {
      try {
        const response = await fetch(newShopData.photo);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
  
        // Update the shop data in Firestore with the new image URL
        await updateDoc(shopRef, { ...newShopData, photo: downloadURL });
        setPhotoURL(downloadURL);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ', error);
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
      setPhotoURL(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
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
      <Image source={{ uri: photoURL }} style={{ width: 100, height: 100 }} />

      <Button title="เลือกรูปภาพ" onPress={openlib} />

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
