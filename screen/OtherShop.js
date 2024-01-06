import React, { useState, useEffect, useRef } from 'react';
    import { TouchableOpacity, StyleSheet, Text, View, Image,ScrollView } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, getDocs, onSnapshot,doc,getDoc,query,orderBy,deleteDoc,updateDoc,addDoc} from 'firebase/firestore'; 
import { FIRESTORE_DB } from '../firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // นำเข้าไอคอนจาก FontAwesome หรือไลบรารีอื่น ๆ ตามที่คุณต้องการmport react-native link react-native-vector-icons


export default function OtherShop({ userUid }) {
  const [shops, setShops] = useState([]); 
  const [photo, setPhoto] = useState(null);
  const [isLiked, setIsLiked] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  
  const db = FIRESTORE_DB;
  const auth = getAuth();
  const navigation = useNavigation();

//   console.log('OtherShop: ',userUid);
  
  
  useEffect(() => {
    const q = query(collection(db, 'allpostShop'), orderBy('timestamp', 'desc'));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedShops = [];
      snapshot.forEach((doc) => {
        const shop = { id: doc.id, ...doc.data() };
        // Filter posts based on the userUid prop
        if (shop.userUid === userUid) {
          updatedShops.push(shop);
        }
      });
      setShops(updatedShops);
    });
  
    return () => {
      // Unsubscribe when the component is unmounted
      unsubscribe();
    };
  }, [userUid]); // ใส่ currentUser เป็น dependency เพื่อให้ useEffect ทำงานเมื่อ currentUser เปลี่ยนแปลง
  
  

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
      <ScrollView>
      {shops.map((shop, index) => {
      if (shop.userUid === userUid) {
        return (
          <TouchableOpacity key={index} style={styles.product}>
          <Card style={styles.card}>
              <View style={styles.iconContainer}>
              </View>
            <Card style={{ width: 200, height: 100, left: 70 }}>
              {shop.photo && (
                <Image source={{ uri: shop.photo }} style={{ width: 200, height: 100, marginRight: 20 }} />
              )}
            </Card>
            <View style={{ top: -40 }}>
              <View style={{ left: 60 }}>
              
              <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 , backgroundColor:'#1C1441'}} color={'#FFF'} />
            <Image
              source={{ uri: shop.profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 50, height:50, left: -60, top: 40 }}
            /> 
            
                <Text style={{ top: -5, fontWeight: 'bold' }}>{shop.username}</Text>
                <Text style={{ top: -5 }}>{shop.faculty}</Text>
                <Text style={{color: '#777267'}}>{formatPostTime(shop.timestamp)}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 40, top: 10 }}>
                {shop.cate}      {shop.name}
              </Text>
            </View>
            <View style={styles.conta}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>ราคา: {shop.prict} บาท</Text>
            </View>
            <View style={styles.cont}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>ติดต่อ: {shop.phon} </Text>
            </View>
          </Card>
        </TouchableOpacity>
        );
      }
      return null;
           })}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ให้ container ขยายตามพื้นที่ของ parent component
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#8AD1DB'
  },
  product: {
    margin: 10,
  },
  card: {
    width: '90%', // กำหนดขนาดของ card เป็น 90% ของหน้าจอ
    alignSelf: 'center', // จัดการแสดงตำแหน่งตาม center
    padding: 10,
    margin: 10,
  },

  conta: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 40,
    top: -20,
  },
  cont: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 40,
    top: -10,
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
