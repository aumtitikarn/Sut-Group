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

      useEffect(() => {
        fetchUsers();
        if (facultyTextRef.current) {
            facultyTextRef.current.measure((fx, fy, width, height, px, py) => {
              setFacultyWidth(width);
              setFacultyHeight(height);
            });
          }
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
                <Text style={styles.userDataText}> {userData.username}</Text>
                <View>
                  <Text style={styles.userDataText}> #{userData.faculty}</Text>
                </View>
            </View>
        </View>
      )
    };
    const styles = StyleSheet.create({
        userDataContainer: {
            top: -10
          },
          userDataText: {
            fontSize: 18,
            padding: 5
          },
      });
      
      export default UserData;
