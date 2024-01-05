import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import GChat from './GChat';

export default function Chat() {
  const [allChatData, setAllChatData] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const navigation = useNavigation();
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const currentUserUid = user.uid;
          setUserUid(currentUserUid);
          const userDocRef = doc(db, 'users', currentUserUid);
          const allChatCollectionRef = collection(userDocRef, 'allchat');
  
          const unsubscribeSnapshot = onSnapshot(allChatCollectionRef, (querySnapshot) => {
            const allChatDocuments = querySnapshot.docs.map(doc => doc.data());
            setAllChatData(allChatDocuments);
          });

          // Save the unsubscribe function to clean up the listener when the component unmounts
          return () => unsubscribeSnapshot();
        } else {
          console.error('User not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching allchat data:', error);
      }
    });

    // Cleanup the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#FDF4E2', height: 30, top: -30 }}>
        <Image style={styles.logo} source={require('../assets/2.png')} />
      </Appbar.Header>
      <GChat />
      <ScrollView >
        {allChatData.map((chat, index) => (
          <TouchableOpacity
            key={index}
            style={{ left: 60, margin:30, left: 30 }}
            onPress={() => navigation.navigate('PrivateChat', { userUid: chat.id })}
          >
              <Avatar.Icon icon="account-circle" size={50} style={{  left: -60, backgroundColor: '#1C1441', position: 'absolute' }} color={'#FFF'} />
              {chat.profileImg && (
                <Image source={{ uri: chat.profileImg }} style={{ borderRadius: 50, position: 'absolute', width: 50, height: 50, left: -60 }} />
              )}
              <Text style={{ fontWeight: 'bold' }}>{chat.username || 'Unknown User'}</Text>
              <Text>{chat.faculty}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff5e2',
    paddingTop: StatusBar.currentHeight,
  },
  logo: {
    height: 50,
    width: 100,
    top: 5,
    left: 130,
  },
});