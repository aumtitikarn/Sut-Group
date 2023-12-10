import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Appbar, Searchbar } from 'react-native-paper';
import { Avatar } from 'react-native-paper';

const PrivateChat = ({ navigation }) => {
  const route = useRoute();
  const { userUid } = route.params;
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const createChatCollection = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const currentUserUid = user.uid;
  
            // Get the current user's document reference
            const currentUserDocRef = doc(db, 'users', currentUserUid);
  
            // Check if the current user's document exists
            const currentUserDocSnapshot = await getDoc(currentUserDocRef);
  
            if (currentUserDocSnapshot.exists()) {
              // Fetch the user data for the specified userUid
              const targetUserDocRef = doc(db, 'users', userUid);
              const targetUserDocSnapshot = await getDoc(targetUserDocRef);
  
              if (targetUserDocSnapshot.exists()) {
                // Set the user data to state
                setUserData(targetUserDocSnapshot.data());
              } else {
                console.error('Target user document not found.');
              }
  
              // Create a new chat document in the 'allchat' collection under the current user's 'users' collection
              const chatDocRef = doc(db, 'users', currentUserUid, 'allchat', userUid);
  
              // Set the initial data for the chat document
              await setDoc(chatDocRef, {
                createdAt: serverTimestamp(),
                // Add other chat-related data as needed
              });
  
            //   console.log(`Chat document for user ${userUid} created successfully.`);
            } else {
              console.error('Current user document not found.');
            }
          } else {
            console.error('User not authenticated.');
          }
        });
      } catch (error) {
        console.error('Error creating chat document:', error);
      }
    };
  
    createChatCollection();
  }, [userUid, db, auth]);

  return (
    <SafeAreaView style={styles.Container}>
      <View>
        {userData && (
          <>
            <Appbar.Header style={{ backgroundColor: '#8AD1DB', height: 30, top: -15 }}>
            <Avatar.Icon icon="account-circle" size={50} style={{ backgroundColor: '#1C1441', marginLeft:10, top: -5 }} color={'#FFF'} />
            <Image
            source={{ uri: userData.profileImg }}
            style={{ width: 50, height: 50, left: 14, top: -15, borderRadius: 50, position: 'absolute' }}
          />
              <Text style={{fontSize: 20, marginLeft: 15,top:-5, fontWeight:"bold"}}>{userData.username}</Text>
            </Appbar.Header>
            <View>
            <Image
            source={{ uri: userData.profileImg }}
            style={{ width: 50, height: 50, marginLeft:180, marginTop: 20, borderRadius: 50}}
          />
              <Text style={{ textAlign: 'center', marginTop: 10, fontWeight:"bold",fontSize: 20 }}>{userData.username}</Text>
              <Text style={{ textAlign: 'center', marginTop: 5, color: "#A4A0A0"}}>{userData.faculty}</Text>
              {/* Render other user data as needed */}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FDF4E2',
    paddingTop: StatusBar.currentHeight,
  },
  logo: {
    height: 50,
    width: 100,
    top:-5
  },
});

export default PrivateChat;
