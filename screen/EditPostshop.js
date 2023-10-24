import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image } from 'react-native';
import { doc, updateDoc,getDownloadURL, ref, uploadString } from 'firebase/firestore';
import { FIRESTORE_DB,FIREBASE_STORAGE  } from '../firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
export default function EditPostShop({ route, navigation }) {
  const { shopId, initialData } = route.params;
  const [newShopData, setNewShopData] = useState(initialData);
  const [photo, setPhoto] = useState(null);

  const handleUpdatePost = async () => {
    const shopRef = doc(FIRESTORE_DB, 'allpostShop', shopId);
    console.log(newShopData);
    
    try {
      await updateDoc(shopRef, newShopData);
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
      navigation.goBack(); // หลังจากแก้ไขสำเร็จให้กลับไปที่หน้าก่อนหน้านี้
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
    }
    if (newShopData.photo) {
      const photoUri = newShopData.photo;
      const storageRef = ref(FIREBASE_STORAGE, `shopPhotos/${shopId}`);
      
      // อัปโหลดรูปภาพไปยัง Firebase Storage
      await uploadString(storageRef, photoUri, 'data_url');
      
      // รับ URL ของรูปภาพที่อัปโหลด
      const downloadURL = await getDownloadURL(storageRef);
      
      // อัปเดตข้อมูลโพสต์รวมถึง URL ของรูปภาพ
      await updateDoc(shopRef, { ...newShopData, photo: downloadURL });
    } else {
      // ถ้าไม่มีรูปภาพถูกเลือก, อัปเดตโพสต์โดยไม่รวม URL รูปภาพ
      await updateDoc(shopRef, newShopData);
    }
  
  };
  const openImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel) {
        // รับ URL ของรูปภาพจาก response.uri
        const photoUri = response.uri;
        setNewShopData({ ...newShopData, photo: photoUri });
      }
    });
  };
  

  return (
    <View style={styles.container}>
      <View>
    <MaterialCommunityIcons 
      name="arrow-left-thick"  
      size={50} style={{margin:10, top: 20}} 
     onPress={() => navigation.goBack()}
      /> 
     
    </View>
    <Text style={{textAlign:'center',top:-30,fontSize:20}}>แก้ไขโพสต์</Text>
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
      {/* เพิ่มฟิลด์อื่น ๆ ที่คุณต้องการให้ผู้ใช้แก้ไข */}
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
