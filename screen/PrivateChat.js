import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, updateDoc, arrayUnion, getDocs, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH, FIREBASE_STORAGE } from '../firestore';
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
  const storage = FIREBASE_STORAGE;

  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [photo, setPhoto] = useState(null);

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
                  // If 'allchat' collection doesn't exist, create it with a placeholder field
                  const { username, profileImg, faculty, id } = currentUserDocSnapshot.data();
    
                  const dataToUpdate = {
                    username,
                    faculty,
                    id
                  };
                  
                  if (profileImg !== undefined && profileImg !== null) {
                    dataToUpdate.profileImg = profileImg;
                  }
                  
                  // Proceed with creating/updating the document
                  await setDoc(targetUserAllChatCollectionRef, dataToUpdate);
                  
                }
    
                // Create a new chat document in the 'allchat' collection under the current user's 'users' collection
                const chatDocRef = doc(db, 'users', user.uid, 'allchat', userUid);
    
                // Set the initial data for the chat document
                const { username, profileImg, faculty, id } = targetUserDocSnapshot.data(); // Fetch required data
                const dataToUpdate = {
                  username,
                  faculty,
                  id
                };
                
                if (profileImg !== undefined && profileImg !== null) {
                  dataToUpdate.profileImg = profileImg;
                }
                
                // Proceed with creating/updating the document
                await setDoc(chatDocRef, dataToUpdate);
    
              } else {
                // Handle the case where the target user document is not found
                // You can add your own logic here to handle it silently
                // For example, you might want to create a new user document for the target user
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
  
      if (currentUser&& (message || photo)) {
        const currentUserUid = currentUser.uid;
  
        // Get the current user's document reference to fetch the username
        const currentUserDocRef = doc(db, 'users', currentUserUid);
        const currentUserDocSnapshot = await getDoc(currentUserDocRef);
  
        if (currentUserDocSnapshot.exists()) {
          const username = currentUserDocSnapshot.data().username;

  
          // Create a new message document in the 'allchat' collection under the current user's 'users' collection
          const messageCollection = collection(db, 'users', currentUserUid, 'allchat', userUid, 'messages');
          const id = Date.now().toString();
          // Add the message to the collection with the username as the text
          const messageDocRef = {
            text: message,
            sender: username,
            uid: currentUserUid,
            // photo : photo,
            timestamp: serverTimestamp(),
          };
          const newMessageRef = await addDoc(messageCollection, messageDocRef );
          if (photo) {
            const fileName = `${id}.jpg`;
            const storageRef = ref(storage, 'chatImg/' + fileName);
            const response = await fetch(photo);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
      
            // Update the message data with the photo URL
            await updateDoc(newMessageRef, { photo: downloadURL });
          }
          // Clear the input field
          setMessage('');
          setPhoto(null);

          // Add data to the collection of userUid
          const userUidDocRef = doc(db, 'users', userUid);
  
          // Check if the document exists
          const userUidDocSnapshot = await getDoc(userUidDocRef);
  
          if (userUidDocSnapshot.exists()) {

            const mDocRef = collection(db, 'users', userUid, 'allchat', currentUserUid, 'messages');
            // Update the document with new data
            const mDocReff = {
              text: message,
              sender: username,
              uid: currentUserUid,
              // photo : photo,
              timestamp: serverTimestamp(),
            };
            const newMessageReff = await addDoc(mDocRef, mDocReff);
            if (photo) {
              const fileName = `${id}.jpg`;
              const storageRef = ref(storage, 'chatImg/' + fileName);
              const response = await fetch(photo);
              const blob = await response.blob();
              await uploadBytes(storageRef, blob);
              const downloadURL = await getDownloadURL(storageRef);
        
              // Update the message data with the photo URL
              await updateDoc(newMessageReff, { photo: downloadURL });
            }
            // Clear the input field
            setMessage('');
            setPhoto(null);

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
  
   // เข้าถึงกล้อง
const camera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [10, 10],
    quality: 1,
  });

  if (!result.canceled) {
    setPhoto(result.assets[0].uri);
  }
};


// เข้าถึงคลังรูปภาพ
const openlib = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [10, 10],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setPhoto(result.assets[0].uri);
  }
};

  return (
    <SafeAreaView style={styles.Container}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            {userData && (
              <>
                <Appbar.Header style={{ backgroundColor: '#8AD1DB', height: 70, marginTop: -42 }}>
                  <Avatar.Icon icon="account-circle" size={50} style={{ backgroundColor: '#1C1441', marginLeft: 10, top: 0 }} color={'#FFF'} />
                  <Image
                    source={{ uri: userData.profileImg }}
                    style={{ width: 50, height: 50, left: 14, top: 10, borderRadius: 50, position: 'absolute' }}
                  />
                  <Text style={{ fontSize: 20, marginLeft: 15, top: -5, fontWeight: "bold" }}>{userData.username}</Text>
                </Appbar.Header>
                <ScrollView style={{ flexGrow: 1, marginBottom: 80 }}>
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
    <View>
      <Text
      style={{
        left:
          message.uid === currentUserUid ? 320 : 0,
      }}>
        {message.sender}:</Text>
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
    backgroundColor: message.uid === currentUserUid ? '#1C1441' : '#8AD1DB',
    padding: 10,
    borderRadius: 8,
    margin: 5,
    marginLeft: message.uid === currentUserUid ? 50 : 0,
    height: message.photo ? 260 : (message.text ? 'auto' : 0),
  }}
>
  {message.text && (
    <Text style={{ color: 'white' }}>{message.text}</Text>
  )}
  {message.timestamp && (
    <Text style={{ color: 'white', top: message.photo ? 205 : 0 }}>
      {message.timestamp.toDate().toLocaleString()}
    </Text>
  )}
  {message.photo && (
    <Image source={{ uri: message.photo }} style={styles.postImage} />
  )}
</View>
    </View>
    </View>
  ))}
        </View>
                </ScrollView>
                <View style={{width: 420,
    height: photo ? 180 : 70,
    backgroundColor: '#8AD1DB',
    bottom: 0,
    position: 'absolute',}}>
                {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 110,top: 55, margin: 10 }} />}
                <View style={styles.iconContainer}>
                <Icon name="camera" size={20} color="#000" style={styles.icon} onPress={camera}/>
                <Icon name="image" size={20} color="#000" style={styles.icon} onPress={openlib}/>
                </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Aa"
                      value={message}
                      onChangeText={setMessage}
                      multiline={true}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}  disabled={!message && !photo}>
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
  postImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    left: 0,
    top:-20
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
    marginLeft: 20,
    position: "absolute"
  },
  icon: {
    marginRight: 15,
  },
});

export default PrivateChat;