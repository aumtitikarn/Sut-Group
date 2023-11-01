import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView,TouchableOpacity, Switch } from 'react-native';
import { collection, query, where, getDocs, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function UserProfile() {
  const [userData, setUserData] = useState('');
  const [pinEnabled, setPinEnabled] = useState(false);
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

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
    <SafeAreaView style={styles.container}>
        <View>
        <Image source={require('../assets/grey.jpg')} 
        style={{width: 450, height: 150}}
        />
        <Image
                source={{ uri: userData.bigImg }}
                style={{
                width: 450,
                height: 150,
                left: -10,
                position: 'absolute',
                }}
            />
        <MaterialCommunityIcons 
                    name="arrow-left"  
                    size={35} style={{margin:15, position: 'absolute', color: 'black'}} 
                    onPress={() => navigation.navigate('Profile')} 
                />
        <View style={{
          top: -20,
          left: 170
        }}>
          <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor:'orange' }} color={'#FFF'}/>
        </View>
        <Image
          source={{ uri: userData.profileImg }}
          style={{ width: 80, height: 80, left: 170, top: 130, borderRadius: 50, position: 'absolute' }}
        />
    </View>
    <View>
      <Text style={{ fontSize:20, fontWeight: 'bold', left: 20}}>ข้อมูลส่วนตัว</Text>
      <View style={{ top:20 , left: 20}}>
      <Text style={styles.text}>ชื่อผู้ใช้ : {userData.username}</Text>
      <Text style={styles.text}>คณะ : {userData.faculty}</Text>
      <Text style={styles.text}>สาขา : {userData.major}</Text>
      <Text style={styles.text}>อีเมล : {userData.email}</Text>
      </View>
      </View>
      <TouchableOpacity style={styles.buttonYellow} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>แก้ไขข้อมูลส่วนตัว</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#8AD1DB',
      flex: 1,
      paddingTop: StatusBar.currentHeight
    },
    buttonYellow: {
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: '#FDF4E2',
      width: 130,
      padding: 8,
      top: 20,
      left: 20
    },
    text: {
        fontSize: 18
    }
})

export default UserProfile;
