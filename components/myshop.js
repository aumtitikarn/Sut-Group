import React, { useState, useEffect, useRef } from 'react';
    import { TouchableOpacity, StyleSheet, Text, View, Image,ScrollView } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, getDocs, onSnapshot,doc,getDoc,query,orderBy,deleteDoc,updateDoc,addDoc} from 'firebase/firestore'; 
import { FIRESTORE_DB } from '../firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // นำเข้าไอคอนจาก FontAwesome หรือไลบรารีอื่น ๆ ตามที่คุณต้องการmport react-native link react-native-vector-icons


export default function MyShop() {
  const [shops, setShops] = useState([]); 
  const [photo, setPhoto] = useState(null);
  const [isLiked, setIsLiked] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  
  const db = FIRESTORE_DB;
  const auth = getAuth();
  const navigation = useNavigation();
  
  
  useEffect(() => {
   
    const q = query(collection(db, 'allpostShop'), orderBy('timestamp', 'desc'));
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      
      const updatedShops = [];
      snapshot.forEach((doc) => {
        const shop = { id: doc.id, ...doc.data() };
        // กรองโพสต์ที่เป็นของผู้ใช้ที่ login อยู่
        if (shop.userUid === currentUser?.uid) {
          updatedShops.push(shop);
         
        }
      });
      setShops(updatedShops);
      
    });
  
    return () => {
      // ยกเลิก subscription เมื่อ component ถูก unmounted
      unsubscribeAuth();
      unsubscribe();
    };
  }, [currentUser]); // ใส่ currentUser เป็น dependency เพื่อให้ useEffect ทำงานเมื่อ currentUser เปลี่ยนแปลง
  
  
  const handleEdit = (shopId) => {
    const shop = shops.find((shop) => shop.id === shopId);

    if (shop.userUid === currentUser?.uid) {
      navigation.navigate('EditPostShop', { shopId, initialData: shop });
    } else {
      console.log('คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้');
    }
  };
  const deleteShop = async (shopId) => {
    const shop = shops.find((shop) => shop.id === shopId);
    try {
      
      const allpostShopRef = doc(db, 'allpostShop', shopId);
      const postShopRef = doc(db, 'postShop', shopId);
  
      // ตรวจสอบว่าโพสต์ที่ต้องการลบถูกโพสต์โดย user ที่ login หรือไม่
      if (shop.userUid === currentUser.uid) {
        // ลบโพสต์จาก allpostShop collection
        await deleteDoc(allpostShopRef);
        // ลบโพสต์จาก postShop collection
        await deleteDoc(postShopRef);
  
        console.log('โพสต์ถูกลบเรียบร้อยแล้ว');
      } else {
        console.log('คุณไม่มีสิทธิ์ในการลบโพสต์นี้');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบโพสต์: ', error);
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
      <ScrollView>
      {shops.map((shop, index) => {
      if (shop.userUid === currentUser?.uid) {
        return (
          <TouchableOpacity key={index} style={styles.product}>
          <Card style={styles.card}>
              <View style={styles.iconContainer}>
              {shop.userUid === currentUser?.uid && (
                  <>
                <TouchableOpacity onPress={() => handleEdit(shop.id)}>
                  <Icon name="edit" size={24} color="#3498db" style={{left:285,top:2}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteShop(shop.id)}>
                  <Icon name="trash" size={24} color="#e74c3c" style={styles.icon} />
                </TouchableOpacity>  
                </>  
              )}    
              </View>
            <Card style={{ width: 200, height: 100, left: 70 }}>
              {shop.photo && (
                <Image source={{ uri: shop.photo }} style={{ width: 200, height: 100, marginRight: 20 }} />
              )}
            </Card>
            <View style={{ top: -40 }}>
              <View style={{ left: 60 }}>
              
              <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 , backgroundColor:'orange'}} color={'#FFF'} />
            <Image
              source={{ uri: shop.profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 50, height:50, left: -60, top: 40 }}
            /> 
            
                <Text style={{ top: -5, fontWeight: 'bold' }}>{shop.username}</Text>
                <Text style={{ top: -5 }}>{shop.faculty}</Text>
                <Text style={{color: '#777267'}}>{formatPostTime(shop.timestamp)}</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 40, top: 10 }}>ประเภท: {shop.cate}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 40, top: 20 }}>
               ชื่อสินค้า: {shop.name}
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
    top: -10,
  },
  cont: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 40,
    top: 1,
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
