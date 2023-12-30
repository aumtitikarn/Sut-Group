import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet,Text,Image,TouchableOpacity ,SafeAreaView} from 'react-native';
import { doc, updateDoc,   } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FIRESTORE_DB,FIREBASE_STORAGE ,FIREBASE_AUTH } from '../firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import { NativeBaseProvider } from "native-base";


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
export default function EditPostShop({ route }) {
  const { shopId, initialData } = route.params;
  const [newShopData, setNewShopData] = useState(initialData);
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const navigation = useNavigation();


  const handleSaveChanges = async () => {
    try {
      const userUid = auth.currentUser.uid;
      const userDocRef = doc(db, 'postShop', userUid);
  
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

      // ตรวจสอบว่ามีข้อมูลที่ควรอัปเดตหรือไม่
      if (Object.keys(updatedUserData).length > 0) {
        // อัปเดตข้อมูลผู้ใช้
        await updateDoc(userDocRef, updatedUserData);
  
        // อัปเดตข้อมูลในคอลเลกชัน  ของผู้ใช้
        const userPostShopCollectionRef = collection(db, 'allpostShop');
        const userPostShopQuery = query(userPostShopCollectionRef, where('shopId', '==', shopId));
  
        const userPostShopSnapshot = await getDocs(userPostShopQuery);
        const batch = writeBatch(db);
  
        userPostShopSnapshot.forEach((doc) => {
          batch.update(doc.ref, updatedUserData);
        });
  
        await batch.commit();
       
        alert('Data updated');
        
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

      navigation.goBack();
      await updateDoc(shopRef, newShopData,{ ...newShopData, shopId });
      console.log('โพสต์ถูกอัปเดตเรียบร้อยแล้ว');
     
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโพสต์: ', error);
    }
  
    
  };
  
  
  
  
  return (
    <NativeBaseProvider>
    <SafeAreaView style={styles.container}>
     
    <MaterialCommunityIcons 
      name="arrow-left"  
      size={45} style={{ top: 40}} 
     onPress={() => navigation.goBack()}
      /> 
     
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
      <Button title="บันทึกการแก้ไข" onPress={handleUpdatePost} />
      </View>
    </SafeAreaView>
    </NativeBaseProvider>
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
