import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image,TouchableOpacity } from 'react-native';
import { doc, updateDoc,getDownloadURL, ref, uploadString } from 'firebase/firestore';
import { FIRESTORE_DB,FIREBASE_STORAGE  } from '../firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
export default function EditPostShop({ route, navigation }) {
  const { shopId, initialData } = route.params;
  const [newShopData, setNewShopData] = useState(initialData);
  const [photo, setPhoto] = useState(null);
 


 
  
  const handleUpdatePost = async () => {
    const shopRef = doc(FIRESTORE_DB, 'allpostShop', shopId);

    try {
      await updateDoc(shopRef, newShopData);
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
      navigation.goBack();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
    }
  
    if (newShopData.photo && newShopData.photo !== null && newShopData.photo !== undefined) {
      const photoUri = newShopData.photo;
      const storageRef = ref(FIREBASE_STORAGE, `shopPhotos/${shopId}`);
  
      try {
        const response = await fetch(photoUri);
        const blob = await response.blob();
  
        await uploadString(storageRef, blob, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);
  
        await updateDoc(shopRef, { ...newShopData, photo: downloadURL });
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ', error);
      }
    } else {
      await updateDoc(shopRef, newShopData);
    }
  };

  const openImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setNewShopData({ ...newShopData, photo: result.uri });
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเลือกรูปภาพ: ', error);
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
      <Button title="เลือกรูปภาพ" onPress={openImagePicker} />

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