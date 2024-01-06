import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firestore';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import OProfile from './OProfile';

const OtherProfile = ({ route }) => {
  const { userUid } = route.params;
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  // Reference to the Firestore database
  const db = FIRESTORE_DB;

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(db, 'users', userUid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the document exists, set the user data
        const userDataFromFirebase = userDocSnapshot.data();
        setUserData(userDataFromFirebase);
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userUid, db]);

  return (
    <SafeAreaView style={styles.Container}>
    <View>
      {userData && (
        <>
        <Image source={require('../assets/grey.jpg')} 
        style={{width: 450, height: 150}}
        />
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
          <View style={{ top: -40, left: 20 }}>
            <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor: '#1C1441' }} color={'#FFF'} />
          </View>
          <Image
            source={{ uri: userData.profileImg }}
            style={{ width: 80, height: 80, left: 20, top: 110, borderRadius: 50, position: 'absolute' }}
          />
          <View style={styles.userDataContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#1C1441" }}> {userData.username}</Text>
            <View>
              <Text style={styles.userDataText}> {userData.faculty}</Text>
            </View>
            <TouchableOpacity style={styles.buttonYellow} onPress={() => navigation.navigate('PrivateChat', { userUid: userUid })}>
          <Text >ส่งข้อความ</Text>
        </TouchableOpacity>
          </View>
        </>
      )}
    </View>
    <View style={{top:80}}>
    <OProfile userUid={userUid}/>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userDataContainer: {
    left: 110,
    top: -75
  },
  Container: {
    backgroundColor: '#FFF',
    paddingTop: StatusBar.currentHeight,
  },
  userDataText: {
    fontSize: 18,
    padding: 5,
    color: "#1C1441",
    left: -10
  },
  buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FDF4E2',
    width: 85,
    padding: 8,
    margin: 5,
    top: 70,
    position: 'absolute'
  },
});

export default OtherProfile;
