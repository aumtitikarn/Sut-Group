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
import { getDoc, doc, setDoc, updateDoc, query, collection, where, getDocs, writeBatch,updatedData } from 'firebase/firestore'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-paper';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SelectDropdown from 'react-native-select-dropdown';


const type = ["คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
const EditPostShop = ({ route, navigation }) => {
  const [userData, setUserData] = useState({});
  const [shop,setShop]=useState({});
  const [newData, setNewData] = useState({
      name: '',
      prict: '',
      cate: '',
      photo: '', // สร้าง key สำหรับเก็บ URL ของรูปภาพ
  });
  const db = FIRESTORE_DB;
  const [photo, setPhoto] = useState('');
  const [shopData, setShopData] = useState(null); // สร้าง state ใหม่เพื่อเก็บข้อมูลโพสต์

  const { shopId } = route.params;
  // ดึงข้อมูลโพสต์จาก Firestore โดยใช้ postId
  
  const fetchShopData = async () => {
    const shopDocRef = doc(db, 'postShop', shopId);
    
    try {
      const shopDoc = await getDoc(shopDocRef);
      if (shopDoc.exists()) {
        const shop = shopDoc.data();
        setNewData({
          name: shop.name || '',
          prict: shop.prict || '',
          cate: shop.cate || '',
          photo: shop.photo || '', // ตั้งค่า URL ของรูปภาพ (ถ้ามี)
        });
      } else {
        console.log('ไม่พบโพสต์ที่ต้องการแก้ไข');
      }
    } catch (error) {
      console.error('Error fetching post data:', error.message);
    }
  };
  

  // ใช้ useEffect เพื่อดึงข้อมูลโพสต์เมื่อ component โหลด
  useEffect(() => {
      fetchShopData();
  }, []);

  // ฟังก์ชันเมื่อกดบันทึกการแก้ไข
  const handleSaveChanges = async () => {
      const shopDocRef = doc(db, 'postShop', shopId);

      try {
          // สร้างอ็อบเจกต์ที่ใช้เพื่อเก็บข้อมูลที่ควรอัปเดต
          const updatedData = { ...newData };

          // ตรวจสอบและเพิ่มข้อมูลเฉพาะเมื่อมีค่าใน newData
          if (newData.name) {
              updatedData.name = newData.name;
          }
          if (newData.prict) {
              updatedData.prict = newData.prict;
          }
          if (newData.cate) {
              updatedData.cate = newData.cate;
          }
          if (newData.photo) {
              updatedData.photo = newData.photo;
          }

          // อัปเดตข้อมูลใน Firestore
          await updateDoc(shopDocRef, updatedData);
          alert('บันทึกข้อมูลแล้ว');
          navigation.navigate('Market'); // หลังจากบันทึกเสร็จให้กลับไปยังหน้า Market
      } catch (error) {
          console.error('Error updating post data:', error.message);
      }
  };

  // ฟังก์ชันเมื่อเลือกรูปภาพจากไลบรารี
  const openLibrary = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [10, 10],
          quality: 1,
      });

      if (!result.cancelled && result.uri) {
          setPhoto(result.uri);
          setNewData({ ...newData, photo: result.uri }); // ตั้งค่า URL ของรูปภาพให้กับ newData
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
               
                placeholder="ประเภทสินค้า"
                data={type}
                onChangeText={(cate) => setNewData({ ...newData, cate: cate })}
                value={newData.cate}
            />
        </View>
        <View style={{ top: -30, left: 100, margin: 5 }}>
        <TextInput
                style={styles.input}
                placeholder="ชื่อสินค้า"
                onChangeText={(name) => setNewData({ ...newData, name: name })}
                value={newData.name}
            />
        </View>
        <View style={{ top: -30, left: 100, margin: 5 }}>
        <TextInput
                style={styles.input}
                placeholder= "ราคา" 
                onChangeText={(prict) => setNewData({ ...newData, prict: prict })}
                value={newData.prict}
            />

        </View>
        <View style={{left:80}}>
        <TouchableOpacity style={styles.buttonYellow} onPress={openLibrary}>
                <Text style={styles.buttonText}>เลือกรูปภาพ</Text>
            </TouchableOpacity>
            </View>
            {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100 }} />}
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
        width: 100,
        padding:5,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        margin: 5
      },
    });
    export default EditPostShop;