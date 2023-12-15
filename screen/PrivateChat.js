import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, updateDoc, arrayUnion, getDocs, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Appbar, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const PrivateChat = ({ navigation }) => {
  const route = useRoute();
  const { userUid } = route.params;
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;

  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUserUid, setCurrentUserUid] = useState(null);

  useEffect(() => {
    const createChatCollection = async () => {
      try {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUserUid(user.uid);

            // Get the current user's document reference
            const currentUserDocRef = doc(db, 'users', user.uid);

            // Check if the current user's document exists
            const currentUserDocSnapshot = await getDoc(currentUserDocRef);

            if (currentUserDocSnapshot.exists()) {
              // Fetch the user data for the specified userUid
              const targetUserDocRef = doc(db, 'users', userUid);
              const targetUserDocSnapshot = await getDoc(targetUserDocRef);

              if (targetUserDocSnapshot.exists()) {
                // Set the user data to state
                setUserData(targetUserDocSnapshot.data());

                // Add 'allchat' collection to the target user's document
                const targetUserAllChatCollectionRef = doc(db, 'users', userUid, 'allchat', user.uid);

                // Check if 'allchat' collection already exists
                const targetUserAllChatCollectionSnapshot = await getDoc(targetUserAllChatCollectionRef);

                if (!targetUserAllChatCollectionSnapshot.exists()) {
                  // If 'allchat' collection doesn't exist, create it
                  await setDoc(targetUserAllChatCollectionRef, {});
                }

                // Create a new chat document in the 'allchat' collection under the current user's 'users' collection
                const chatDocRef = doc(db, 'users', user.uid, 'allchat', userUid);

                // Set the initial data for the chat document
                await setDoc(chatDocRef, {
                  createdAt: serverTimestamp(),
                  // Add other chat-related data as needed
                });

                console.log(`Chat document for user ${userUid} created successfully.`);
              } else {
                console.error('Target user document not found.');
              }
            } else {
              console.error('Current user document not found.');
            }
          } else {
            console.error('User not authenticated.');
          }
        });

        // Clean up the auth state listener when the component unmounts
        return () => unsubscribeAuth();
      } catch (error) {
        console.error('Error creating chat document:', error);
      }
    };

    const fetchMessages = async () => {
  try {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const currentUserUid = currentUser.uid;
      const messagesCollectionRef = collection(db, 'users', currentUserUid, 'allchat', userUid, 'messages');

      // Use onSnapshot to listen for real-time updates to the messages collection
      const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map(doc => doc.data());
        setMessages(messagesData);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    } else {
      console.error('User not authenticated.');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

    createChatCollection();
    fetchMessages();
  }, [userUid, db, auth]);


  const sendMessage = async () => {
    try {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const currentUserUid = currentUser.uid;
  
        // Get the current user's document reference to fetch the username
        const currentUserDocRef = doc(db, 'users', currentUserUid);
        const currentUserDocSnapshot = await getDoc(currentUserDocRef);
  
        if (currentUserDocSnapshot.exists()) {
          const username = currentUserDocSnapshot.data().username;
  
          // Create a new message document in the 'allchat' collection under the current user's 'users' collection
          const messageDocRef = collection(db, 'users', currentUserUid, 'allchat', userUid, 'messages');
  
          // Add the message to the collection with the username as the text
          await addDoc(messageDocRef, {
            text: message,
            sender: username,
            uid: currentUserUid,
            timestamp: serverTimestamp(),
          });
  
          // Clear the input field
          setMessage('');
  
          // Add data to the collection of userUid
          const userUidDocRef = doc(db, 'users', userUid);
  
          // Check if the document exists
          const userUidDocSnapshot = await getDoc(userUidDocRef);
  
          if (userUidDocSnapshot.exists()) {

            const mDocRef = collection(db, 'users', userUid, 'allchat', currentUserUid, 'messages');
            // Update the document with new data
            await addDoc(mDocRef, {
              text: message,
              sender: username,
              uid: currentUserUid,
              timestamp: serverTimestamp(),
            });
  
            // Clear the input field
            setMessage('');
          } else {
            console.error('UserUid document not found.');
          }
        } else {
          console.error('Current user document not found.');
        }
      } else {
        console.error('User not authenticated.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  

  return (
    <SafeAreaView style={styles.Container}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            {userData && (
              <>
                <Appbar.Header style={{ backgroundColor: '#8AD1DB', height: 30, top: -15 }}>
                  <Avatar.Icon icon="account-circle" size={50} style={{ backgroundColor: '#1C1441', marginLeft: 10, top: -5 }} color={'#FFF'} />
                  <Image
                    source={{ uri: userData.profileImg }}
                    style={{ width: 50, height: 50, left: 14, top: -15, borderRadius: 50, position: 'absolute' }}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 15, top: -5, fontWeight: "bold" }}>{userData.username}</Text>
                </Appbar.Header>
                <ScrollView>
                <View>
                <Avatar.Icon icon="account-circle" size={50} style={{ backgroundColor: '#1C1441', marginLeft: 10, top: -5, position: 'absolute', alignSelf: 'center', top: 20 }} color={'#FFF'} />
            <Image
            source={{ uri: userData.profileImg }}
            style={{ width: 50, height: 50, marginLeft:180, marginTop: 20, borderRadius: 50}}
          />
              <Text style={{ textAlign: 'center', marginTop: 10, fontWeight:"bold",fontSize: 20 }}>{userData.username}</Text>
              <Text style={{ textAlign: 'center', marginTop: 5, color: "#A4A0A0"}}>{userData.faculty}</Text>
              {messages
  .slice()
  .sort((a, b) => {
    const timestampA = a.timestamp ? a.timestamp.toMillis() : 0;
    const timestampB = b.timestamp ? b.timestamp.toMillis() : 0;
    return timestampA - timestampB;
  })
  .map((message, index) => (
    <View
      key={index}
      style={{
        flexDirection: 'row',
        justifyContent:
          message.uid === currentUserUid ? 'flex-end' : 'flex-start',
      }}
    >
      <View
        style={{
          backgroundColor:
            message.uid === currentUserUid ? '#1C1441' : '#8AD1DB',
          padding: 10,
          borderRadius: 8,
          margin: 5,
          marginLeft: message.uid === currentUserUid ? 50 : 0,
        }}
      >
        <Text style={{ color: 'white' }}>{message.text}</Text>
        {message.timestamp && (
          <Text style={{ color: 'white' }}>
            {message.timestamp.toDate().toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  ))}

        </View>
                </ScrollView>
                <View style={styles.square}>
                <View style={styles.iconContainer}>
                  <Icon name="camera" size={20} color="#000" style={styles.icon}/>
                  <Icon name="image" size={20} color="#000" style={styles.icon} />
                </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Aa"
                      value={message}
                      onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                      <Text style={styles.sendButtonText}>Sent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FDF4E2',
    paddingTop: StatusBar.currentHeight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    position: "absolute"
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 20,
    marginLeft: 90,
    paddingLeft: 10,
    backgroundColor: 'white'
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius:30,
    left: -10,
    backgroundColor: '#1C1441'
  },
  sendButtonText: {
    color: 'white'
  },
  logo: {
    height: 50,
    width: 100,
    top: -5
  },
  square: {
    width: 420,
    height: 70,
    backgroundColor: '#8AD1DB',
    bottom: 0,
    position: 'absolute',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    top:20,
    marginLeft: 20
  },
  icon: {
    marginRight: 15,
  },
});

export default PrivateChat;