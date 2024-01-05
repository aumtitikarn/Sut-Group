import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, where, getDoc, doc, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function GChat() {
  const [allChatData, setAllChatData] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [userFaculty, setUserFaculty] = useState('');
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation(); // เพิ่ม hook นี้
  

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
  
  useEffect(() => {
    // Fetch group chat data based on user's faculty
    const fetchGroupChatData = async () => {
      try {
        const userDocRef = doc(db, 'users', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userFaculty = userDocSnapshot.data().faculty;
  
        const groupChatCollectionRef = collection(db, 'groupchat');
        const facultyQuery = where('users', 'array-contains', userUid);
        const groupChatQuery = query(groupChatCollectionRef, facultyQuery);
        const groupChatQuerySnapshot = await getDocs(groupChatQuery);
  
        // Map through the documents and add 'id' property to each document
        const groupChatDocuments = groupChatQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          faculty: userFaculty,
        }));
  
        setAllChatData(prevData => [...prevData, ...groupChatDocuments]);
      } catch (error) {
        console.error('Error fetching group chat data:', error);
      }
    };
  
    fetchGroupChatData();
  }, [userUid]);
  

  
  return (
    <SafeAreaView style={styles.container}>
      {allChatData.map((chat, index) => (
        <TouchableOpacity 
          key={index} 
          style={{ left: 60, marginTop:-20}}
          onPress={() => navigation.navigate('GroupChat', { userUid: userUid ,docId: chat.id })}
        >
          {Array.isArray(chat.users) && chat.users.includes(userUid) && (
            <>
              <View style={styles.circleContainer}>
                <MaterialCommunityIcons 
                  name="account-group"  
                  size={25}
                />
              </View>
              <View style={{ marginTop: 10, left: -25 }}>
                <Text style={{ fontWeight: 'bold' }}>{chat.faculty}</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff5e2',
  },
  circleContainer: {
    backgroundColor: '#8AD1DB',
    borderRadius: 100,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    left: -80,
    top: 50
  },
});
