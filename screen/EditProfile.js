import React, { useState, useEffect, useRef } from 'react';
import {
  Text, StyleSheet, View, Image, ScrollView, SafeAreaView, StatusBar
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, getDoc, doc } from 'firebase/firestore'; // Import Firestore functions for fetching data
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
      
          const userDoc = await getDoc(userDocRef); // เปลี่ยนเป็น getDoc
          const userData = userDoc.data();
      
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      };

      return (
        <SafeAreaView style={styles.container}>
        <View>
            <View>
                <Image source={require('../assets/grey.jpg')} 
                style={{width: 450, height: 150}}
                />
            </View>
        <View style={{
              top: -50,
              left: 160
              
            }}>
                <Avatar.Icon icon="account-circle" size={100} />
            </View>
        <Text style={{fontWeight: 'bold', fontSize: 20, margin: 10}}>
            แก้ไขข้อมูลส่วนตัว
        </Text>
        </View>
        </SafeAreaView>
      )
    };
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF6DE',
        flex: 1,
        paddingTop: StatusBar.currentHeight
      },
    userDataContainer: {
        top: -70,
        left: 110
    },
    userDataText: {
        fontSize: 18,
        padding: 5
    },
      });
      
export default UserData;
