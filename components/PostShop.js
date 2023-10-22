import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, getDocs, onSnapshot,doc,getDoc,query,orderBy,deleteDoc } from 'firebase/firestore'; 
import { FIRESTORE_DB } from '../firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // นำเข้าไอคอนจาก FontAwesome หรือไลบรารีอื่น ๆ ตามที่คุณต้องการmport react-native link react-native-vector-icons


export default function PostShop() {
  const [shops, setShops] = useState([]); 
  const [photo, setPhoto] = useState(null);
  const [userData, setUserData] = useState({});
  const db = FIRESTORE_DB;
  const auth = getAuth();
  const navigation = useNavigation();
  useEffect(() => {
    // สร้างคิวรีสำหรับคอลเลคชัน "allpostHome" และเรียกใช้ onSnapshot
    const q = query(collection(db, 'allpostShop'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedShops = [];
      snapshot.forEach((doc) => {
        updatedShops.push({ id: doc.id, ...doc.data() });
      });
      setShops(updatedShops);
    });

    return () => {
      // ยกเลิกการสั่งสอบถามเมื่อคอมโพนเมนต์ถูกถอนออก
      unsubscribe();
    }
    
  }, []);
  const handleEdit = (shopId) => {
    // นำผู้ใช้ไปที่หน้าแก้ไขโพสต์ (ให้กำหนดค่า postId ใน navigation params)
    navigation.navigate('EditPostShop',{shopId});
  };
  
  const handleDelete = async (shopId) => {
    try {
      
      // ลบโพสต์จากฐานข้อมูล
      await deleteShop(shopId);
      // หลังจากลบโพสต์สำเร็จ คุณอาจต้องโหลดโพสต์ใหม่หรือทำอย่างอื่นตามที่คุณต้องการ
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบโพสต์: ', error);
    }
  };
  const deleteShop = async (shopId) => {
    try {
      const shopRef = doc(db, 'allpostShop', shopId, );
      await deleteDoc(shopRef);
      console.log('โพสต์ถูกลบเรียบร้อยแล้ว');
    } catch (error) {
      throw new Error('เกิดข้อผิดพลาดในการลบโพสต์');
    }
  };
  
  
  const formatPostTime = (timestamp) => {
    if (timestamp) {
      // ดึงค่าเวลาปัจจุบัน
      const now = new Date().getTime();
  
      // แปลง timestamp เป็น milliseconds ให้กับ JavaScript Date Object
      const postTime = new Date(timestamp.toDate());
  
      // คำนวณความต่างระหว่างเวลาปัจจุบันกับเวลาโพสต์
      const timeDifference = now - postTime.getTime();
  
      // แปลง milliseconds เป็นวินาที
      const seconds = Math.floor(timeDifference / 1000);
  
      // แปลงวินาทีเป็นนาที
      const minutes = Math.floor(seconds / 60);
  
      // แปลงนาทีเป็นชั่วโมง
      const hours = Math.floor(minutes / 60);
  
      // แปลงชั่วโมงเป็นวัน
      const days = Math.floor(hours / 24);
  
      if (days > 0) {
        return `เมื่อ ${days} วันที่แล้ว`;
      } else if (hours > 0) {
        return `เมื่อ ${hours} ชั่วโมงที่แล้ว`;
      } else if (minutes > 0) {
        return `เมื่อ ${minutes} นาทีที่แล้ว`;
      } else if (seconds > 0) {
        return `เมื่อ ${seconds} วินาทีที่แล้ว`;
      } else {
        return 'เมื่อไม่นานมานี้';
      }
    } else {
      return 'ไม่มีข้อมูลวันที่';
    }
    
  }
  
  

  return (
    <View style={styles.container}>
      {shops.map((shop, index) => (
       <TouchableOpacity key={index} style={styles.product}>
          <Card style={styles.card}>
           
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(shop.id)}>
              <Icon name="edit" size={24} color="#3498db" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(shop.id)}>
              <Icon name="trash" size={24} color="#e74c3c" style={styles.icon} />
            </TouchableOpacity>          
          </View>
           <Card style={{ width: 200, height: 100 ,left:70}} >{shop.photo && (
        <Image source={{ uri: shop.photo }} style={{ width: 200, height: 100 ,marginRight:20}} />
        )}</Card>
          <View style={{top:-40}}>
            <View style={{left:60}} >
              <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 }} />
           <Text style={{ top: -5, fontWeight: 'bold' }}>{shop.username}</Text>
              <Text style={{ top: -5,}}>#{shop.faculty}</Text>
             
            </View>
             <Text style={{ fontSize: 16, fontWeight: 'bold' ,marginLeft:40 ,top:10 }}>
                {shop.cate}  {shop.name}
              </Text>
              </View>
            <View style={styles.conta}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                ราคา: {shop.prict } บาท
              </Text>
            </View>
            </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'comlum',
    flexWrap: 'wrap',
    justifyContent: 'center',
     // แยกแต่ละ Card ด้วยระยะห่าง
  },
  product: {
    margin: 10,
    
     // ให้แต่ละ Card มีความกว้าง 45% ของหน้าจอ
  },
  card: {
    width: 370,
    padding: 10,
    margin: 20,
    height:250
  

  },
  conta: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 40,
    top:-30
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  icon: {
    marginRight: 2,
   
  },
});