import React, { useState, useEffect, useRef } from 'react';
import {
  Text, StyleSheet, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'; // Import Firestore functions for fetching data
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';

const UserData = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;
    const profileImageUnsubscribeRef = useRef(null); // สร้าง ref เพื่อเก็บ unsubscribe function

    const fetchUsers = async () => {
      try {
        const userUid = auth.currentUser.uid;
        const userCollectionRef = collection(db, 'users');
        const userDocRef = doc(userCollectionRef, userUid);

        // ใช้ onSnapshot เพื่อติดตามการเปลี่ยนแปลงในเอกสารของผู้ใช้
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
          }
        });

        // เพื่อคลุมครองการแบ่งปัน ต้องนำออกเมื่อคอมโพเนนต์ถูกคลุมครอง (unmounted)
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching user data: ', error);
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
      <View>
        <Image
                source={{ uri: userData.bigImg }}
                style={{
                width: 450,
                height: 150,
                top: -80,
                left: -110,
                position: 'absolute',
                }}
            />
        <View style={{
          top: 30,
          left: -90
        }}>
          <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor:'orange' }} color={'#FFF'}/>
        </View>
        <Image
          source={{ uri: userData.profileImg }}
          style={{ width: 80, height: 80, left: -90, top: 30, borderRadius: 50, position: 'absolute' }}
        />
        <View style={styles.userDataContainer}>
          <Text style={{fontSize:18, fontWeight:'bold', color: "#1C1441"}}> {userData.username}</Text>
          <View>
            <Text style={{fontSize: 18,
    padding: 5,
    color: "#1C1441",
    left: -10}}> {userData.faculty}</Text>
          </View>
        </View>
      </View>
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

export default UserData;
