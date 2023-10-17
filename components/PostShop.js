import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, getDocs, onSnapshot,doc,getDoc,query,orderBy } from 'firebase/firestore'; 
import { FIRESTORE_DB } from '../firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import UserData from './userPost';

export default function PostShop() {
  const [shops, setShops] = useState([]); 
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState([]);
  const [userData, setUserData] = useState({});
  const db = FIRESTORE_DB;
  const auth = getAuth();

  const fetchUsers = async () => {
    try {
      
      const userUid = auth.currentUser.uid;
      const userCollectionRef = collection(db, 'users');
      const userDocRef = doc(userCollectionRef, userUid);
  
      const userDoc = await getDoc(userDocRef); // เปลี่ยนเป็น getDoc
      const userData = userDoc.data();
  
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    // สร้างอ้างอิงของคอลเลคชัน 'users'
    const usersCollectionRef = collection(db, 'users');

    const fetchPosts = async () => {
  const userPosts = [];
  const querySnapshot = await getDocs(usersCollectionRef);

  for (const userDoc of querySnapshot.docs) {
    const userUid = userDoc.id;
    const postShopCollectionRef = collection(userDoc.ref, 'postShop');
    const postShopQuerySnapshot = await getDocs(postShopCollectionRef);

    postShopQuerySnapshot.forEach((postDoc) => {
      const postData = postDoc.data();
      const userData = { username: userDoc.data().username, faculty: userDoc.data().faculty };
      userPosts.push({ userId: userUid, ...postData, userData });
    });
  }

  setShops(userPosts);
    };
    const q = query(collection(db, 'allpostShop'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedShop = [];
      snapshot.forEach((doc) => {
        updatedShop.push({ id: doc.id, ...doc.data() });
      });
      setShops(updatedShop);
    });

    return () => {
      // ยกเลิกการสั่งสอบถามเมื่อคอมโพนเมนต์ถูกถอนออก
      unsubscribe();
    };
    fetchUsers();
    fetchPosts();
  }, []);
  

  return (
    <View style={styles.container}>
      {shops.map((shop, index) => (
       <TouchableOpacity key={index} style={styles.product}>
          <Card style={styles.card}>
          <View>
          {shop.photo && (
        <Image source={{ uri: shop.photo }} style={{ width: 100, height: 100 ,marginLeft:50}} />
        )}
          </View>
          
          <View style={{margin:1}}>
            <View style={{ height: 2 ,top: -40,
                left: 80 }} >
            <UserData/>
            </View>  
             <Text style={{ fontSize: 16, fontWeight: 'bold' ,marginLeft:40 ,top:60 }}>
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
    justifyContent: 'space-around',
     // แยกแต่ละ Card ด้วยระยะห่าง
  },
  product: {
    margin: 10,
    
     // ให้แต่ละ Card มีความกว้าง 45% ของหน้าจอ
  },
  card: {
    height: 230,
    width: '200%',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  left:80,

  },
  conta: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 60,
    top:75
  },
});