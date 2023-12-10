import React, { useState, useEffect, useRef } from 'react';
import {
  Text, StyleSheet, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, doc, onSnapshot, query, where,getDoc } from 'firebase/firestore'; // Import Firestore functions for fetching data
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';
import UserData from '../components/userData';

const User = ({ navigation }) => {
    const [user, setUser] = useState({});
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;
   
    
      // นำมาใช้ในกรณีที่ข้อมูลสาขาของผู้ใช้ถูกเก็บไว้ในฟิลด์ 'major'
      const fetchUsers = async () => {
        try {
          const userUid = auth.currentUser.uid;
          const userCollectionRef = collection(db, 'users');
          const userDocRef = doc(userCollectionRef, userUid);
      
          // ดึงข้อมูลสาขาของผู้ที่ล็อกอินอยู่
          const userDocSnapshot = await getDoc(userDocRef);
          const currentUserBranch = userDocSnapshot.data().major;
      
          // สร้าง query เพื่อค้นหาผู้ใช้ที่มีสาขาเดียวกัน
          const userQuery = query(userCollectionRef, where('major', '==', currentUserBranch));
      
          // ใช้ onSnapshot เพื่อติดตามการเปลี่ยนแปลงของข้อมูลผู้ใช้
          const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
              if (doc.exists()) {
                const user = doc.data();
                users.push(user);
              }
            });
            setUser(users);
          });
      
          // ยกเลิกการติดตามเมื่อคอมโพเนนต์ถูก unmounted
          return unsubscribe;
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้: ', error);
        }
      };

    useEffect(() => {
      const unsubscribe = fetchUsers();
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
      
 <View style={{
          top: 30,
          left: -90
        }}>
          <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor:'orange' }} color={'#FFF'}/>
        </View>
        <Image
          source={{ uri: user.profileImg }}
          style={{ width: 80, height: 80, left: -90, top: 30, borderRadius: 50, position: 'absolute' }}
        />
        <View style={styles.userDataContainer}>
          <Text style={{fontSize:18, fontWeight:'bold', color: "#1C1441"}}> {user.username}</Text>
          <View>
            <Text style={{fontSize: 18,
    padding: 5,
    color: "#1C1441",
    left: -10}}> {user.faculty}</Text>
          </View>
      </View>
      </ScrollView>
      </SafeAreaView>
    );
  };
const styles = StyleSheet.create({
  userDataContainer: {
    top: -5
  },
  userDataText: {
    fontSize: 18,
    padding: 5,
    color: "#1C1441",
  },
});

export default User;
