import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, onSnapshot, doc, getDoc, query, orderBy, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PostShop() {
  const [shops, setShops] = useState([]);
  const [isLiked, setIsLiked] = useState([]);
  const [userData, setUserData] = useState({});
  const [likeCount, setLikeCount] = useState([]);
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
      const updatedIsLiked = {};
      const updatedLikeCount = {};
      const updatedShops = [];

      snapshot.forEach((doc) => {
        const shop = { id: doc.id, ...doc.data() };
        updatedShops.push(shop);
        updatedIsLiked[shop.id] = shop.likedBy?.includes(currentUser?.uid) || false;
        updatedLikeCount[shop.id] = shop.like;
      });

      setShops(updatedShops);
      setIsLiked(updatedIsLiked);
      setLikeCount(updatedLikeCount);
    });

    return () => {
      // Unsubscribe when the component is unmounted
      unsubscribeAuth();
      unsubscribe();
    };
  }, [currentUser]);

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
              [shop.id]: !currentIsLiked[shop.id],
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
      const now = new Date().getTime();
      const postTime = new Date(timestamp.toDate());
      const timeDifference = now - postTime.getTime();
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
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
  };

  
  

  return (
    <ScrollView>
    <View style={styles.container}>
    {shops.filter((shop) => isLiked[shop.id]).map((shop, index) => {
         return(
          <TouchableOpacity key={index} style={styles.product}>
          <Card style={styles.card}>
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
                <Text style={{ top: -5 }}>#{shop.faculty}</Text>
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
            <View >
            <TouchableOpacity
    style={{ left: 270 }}
    onPress={() => updateLike(shop)}
>
    <Icon
        name={isLiked[shop.id] ? 'heart' : 'heart-o'}
        size={30}
        color={isLiked[shop.id] ? 'orange' : '#000'}
    />
</TouchableOpacity>
            <View>
            <Text style={{top: -10, left:310}}>{likeCount[shop.id]}</Text>
            </View>
          </View>
          </Card>
        </TouchableOpacity>
        );
           })}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ให้ container ขยายตามพื้นที่ของ parent component
    flexDirection: 'column',
    justifyContent: 'center',
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
    justifyContent: 'flex-end',
    marginVertical: 1,
  },
  icon: {
    marginRight: 2,
  },
});
