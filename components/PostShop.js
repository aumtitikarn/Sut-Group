import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, getDocs, onSnapshot,doc,getDoc,query,orderBy,deleteDoc,updateDoc,addDoc} from 'firebase/firestore'; 
import { FIRESTORE_DB, FIREBASE_STORAGE } from '../firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown'; // นำเข้าไอคอนจาก FontAwesome หรือไลบรารีอื่น ๆ ตามที่คุณต้องการmport react-native link react-native-vector-icons
import Search from './Search';
import { ref, deleteObject } from 'firebase/storage';


export default function PostShop() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [shops, setShops] = useState([]); 
  const [photo, setPhoto] = useState(null);
  const [isLiked, setIsLiked] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);  
  const db = FIRESTORE_DB;
  const auth = getAuth();
  const navigation = useNavigation();
  const type = ["ทั้งหมด", "คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  useEffect(() => {
    const q = query(collection(db, 'allpostShop'), orderBy('timestamp', 'desc'));
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedIsLiked = {};
      const updatedLikeCount = {};
      const updatedShops = [];
      snapshot.forEach((doc) => {
        const shop = { id: doc.id, ...doc.data() };
        updatedShops.push(shop);
        updatedIsLiked[shop.id] = false;
        updatedLikeCount[shop.id] = shop.like;
      });
      setShops(updatedShops);
      setIsLiked(updatedIsLiked);
      setLikeCount(updatedLikeCount);
    });
    return () => {
      // ยกเลิก subscription เมื่อ component ถูก unmounted
      
      unsubscribeAuth();
      unsubscribe();
    };
  }, [auth.currentUser,shops]);
  
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
      await deleteDoc(allpostShopRef);
      const postShopRef = doc(db, 'postShop', shopId);
      await deleteDoc(postShopRef);

  
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
  
  const updateLike = async (shop) => {
    try {
      const userUid = auth.currentUser.uid;
      const shopRef = doc(db, 'allpostShop', shop.id);
      const shopDoc = await getDoc(shopRef);

      if (shopDoc.exists()) {
        const likedBy = shopDoc.data().likedBy || [];
  
        if (likedBy.includes(userUid)) {
          const updatedLikedBy = likedBy.filter((uid) => uid !== userUid);
          const newLikeCount = Math.max(shop.like - 1, 0);
          const updateData = {
            likedBy: updatedLikedBy,
            like: newLikeCount,
          };
  
          await updateDoc(shopRef, updateData);
  
          if (shop.id in isLiked) {
            setIsLiked((currentIsLiked) => ({
              ...currentIsLiked,
              [shop.id]: !currentIsLiked[shop.id], // สลับค่ากลับและคาดหวังว่าไอคอนจะเปลี่ยนสี
            }));
          }
        } else {
          const updatedLikedBy = [...likedBy, userUid];
          const newLikeCount = shop.like + 1;
  
          const updateData = {
            likedBy: updatedLikedBy,
            like: newLikeCount,
          };
  
          await updateDoc(shopRef, updateData);
  
          if (shop.id in isLiked) {
            setIsLiked((currentIsLiked) => ({
              ...currentIsLiked,
              [shop.id]: true,
            }));
          }
          // อัปเดตข้อมูลการไลค์ไปยังคอลเลคชัน "postHome" ใน Firestore
          await updateLikeInPostShop(userUid, shop.id, updatedLikedBy, newLikeCount);
        }
      } else {
        console.error('ไม่พบข้อมูลโพสต์: ', shop.id);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการกดไลค์: ', error);
    }
   
  };
  const updateLikeInPostShop = async (userUid, shopId, likedBy, likeCount) => {
    const postShopRef = doc(db, 'users', userUid, 'postShop', shopId);
    
    const postShopDoc = await getDoc(postShopRef);
    if (postShopDoc.exists()) {
      const updateData = {
        likedBy: likedBy,
        like: likeCount,
      };

      await updateDoc(postShopRef, updateData);
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
  const handleSearch = (query) => {
    setSearchQuery(query);
    // ... โค้ดอื่น ๆ ที่คุณต้องการทำ
  };
 
  const handleMarketPost = () => {
   
    navigation.navigate('Marketpost');

  };
  
  

  return (
    <View>
    <View style={styles.container}>
      <View style={{left:70,top:-40}}>
       <SelectDropdown
          data={type}
            defaultButtonText="ประเภทสินค้า"
            onSelect={(selectedItem, index) => {
              setSelectedCategory(selectedItem);
              setSearchQuery(""); // รีเซ็ตคำค้นหาเมื่อมีการเลือกประเภทใหม่
            }}
               buttonTextAfterSelection={(selectedItem, index) => {
               return selectedItem;
              }}
               rowTextForSelection={(product, index) => {
            return product;
           }}
         />
         </View>
        
     <TouchableOpacity
              style={{
                borderRadius: 5,
                borderWidth: 1,
                backgroundColor: '#FDF4E2',
                width: 90,
                padding: 10,
                top: -20,
                marginLeft: 270,
              }}
              onPress={handleMarketPost}
            >
              <Text  >สร้างสินค้า</Text>
            </TouchableOpacity>

       {shops
  .filter((shop) => selectedCategory === 'ทั้งหมด' || shop.cate === selectedCategory)
  .map((shop, index) => {
         return(
          <TouchableOpacity key={index} style={styles.product}>
          <Card style={styles.card}>
              <View style={styles.iconContainer}>
              {shop.userUid === currentUser?.uid && (
                  <>
                <TouchableOpacity onPress={() => handleEdit(shop.id)}>
                  <Icon name="edit" size={24} color="#3498db" style={{left:250,top:2}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteShop(shop.id)}>
                  <Icon name="trash" size={24} color="#e74c3c" style={styles.icon} />
                </TouchableOpacity>  
                </>  
              )}    
              </View>
            <Card style={{ width: 200, height: 150, left: 60 }}>
              {shop.photo && (
                <Image source={{ uri: shop.photo }} style={{ width: 200, height: 150, marginRight: 20 }} />
              )}
            </Card>
            <View style={{ top: -20 }}>
              <View style={{ left: 60 }}>
              <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 , backgroundColor:'orange'}} color={'#FFF'} />
              
        <Image
          source={{ uri: shop.profileImg }}
          style={{ borderRadius: 50, position: 'absolute', width: 50, height: 50, left: -60, top: 40 }}
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
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>ราคา:  {shop.prict} บาท !!</Text>
            </View>
            <View style={styles.cont}> 
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>ติดต่อ: {shop.phon} </Text>
            </View>
            <View >   
            <TouchableOpacity 
    style={{ left: 268, top: -20 }}
    onPress={() => updateLike(shop)}
>
    <Icon
        name={isLiked[shop.id] ? 'heart' : 'heart-o'}
        size={30}
        color={isLiked[shop.id] ? '#8AD1DB' : '#000'}
    />
</TouchableOpacity>
            <View>
            <Text style={{top: -10, left:280}}>{likeCount[shop.id]}</Text>
            </View>
          </View>
          </Card>
        </TouchableOpacity>
        );
           })}
    </View>
  {/* เพิ่มช่องว่างล่างสุด */}
          <Text></Text>
           <Text></Text>
           <Text></Text>
           <Text></Text>
           <Text></Text>
           <Text></Text>
           <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ให้ container ขยายตามพื้นที่ของ parent component
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
    top: 5,
  },
  cont: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 40,
    top: 10,
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
