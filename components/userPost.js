import React, { useState, useEffect, useRef } from 'react';
import {
  Text, StyleSheet, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, getDoc, doc } from 'firebase/firestore'; // Import Firestore functions for fetching data
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';

const UserData = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;
    
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
        fetchUsers();
      }, []);

      return (
        <View>
            <View style={{
              top: -40,
              left: -100
            }}>
                <Avatar.Icon icon="account-circle" size={50} style={{top : 80, left: 30}} />
            </View>
            <View style={styles.userDataContainer}>
                <Text style={{fontSize:14, fontWeight:'bold'}}> {userData.username}</Text>
                <View>
                  <Text style={styles.userDataText}> #{userData.faculty}</Text>
                </View>
            </View>
        </View>
      )
    };
    const styles = StyleSheet.create({
        userDataContainer: {
            top: -10,
            left: -10
          },
          userDataText: {
            fontSize: 14,
            padding: 5
          },
      });
      
      export default UserData;
