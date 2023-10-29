import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image,TouchableOpacity } from 'react-native';
import { doc, updateDoc,getDoc,onSnapshot  } from 'firebase/firestore';
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
  const db = FIRESTORE_DB;

  const handleUpdatePost = async () => {
    console.log("shopid:". shopId)
    try {
      const id = shopId;
      const storageRef = ref(storage, 'photo_shop/' + `${id}.jpg`);
      const response = await fetch(photo);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      // อัปเดต state เพื่อแสดงข้อมูลใหม่ทันทีหลังจากที่บันทึกข้อมูล
      setNewShopData({
        ...newShopData,
        photo: downloadURL,
        name: newShopData.name,
        prict: newShopData.prict,
        phon: newShopData.phon,
        cate: newShopData.cate,
      });
  
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
      navigation.goBack();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
    }
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'postShop', shopId), (snapshot) => {
      if (snapshot.exists()) {
        const postShopData = snapshot.data();
        setNewShopData(postShopData);
      } else {
        console.log('ไม่พบข้อมูลโพสต์');
      }
    });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe();
    };
  }, [shopId]); 
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
  
        // ดึง URL ของรูปภาพที่อัปโหลด
        const downloadURL = await getDownloadURL(storageRef);
  
        // อัปเดต state และ Firebase Firestore ด้วย URL ของรูปภาพใหม่
        setNewShopData({ ...newShopData, photo: downloadURL });
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ', error);
      }
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