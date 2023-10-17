import React, { useState, useEffect, useRef } from 'react';
import {
  Text, StyleSheet, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, getDoc, doc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions for fetching data
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';

const UserData = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const facultyTextRef = useRef(null);
    const [facultyWidth, setFacultyWidth] = useState(0);
    const [facultyHeight, setFacultyHeight] = useState(0);
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;
    
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
          unsubscribe();
        };
      }, []);

      return (
        <View>
            <View style={{
              top: 30,
              left: -90
            }}>
                <Avatar.Icon icon="account-circle" size={80} />
            </View>
            <View style={styles.userDataContainer}>
                <Text style={{fontSize:18, fontWeight:'bold'}}> {userData.username}</Text>
                <View>
                  <Text style={styles.userDataText}> #{userData.faculty}</Text>
                </View>
            </View>
        </View>
      )
    };
    const styles = StyleSheet.create({
        userDataContainer: {
            top: -5
          },
          userDataText: {
            fontSize: 18,
            padding: 5
          },
      });
      
      export default UserData;
