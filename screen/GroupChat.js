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

const GroupChat = ({ navigation }) => {
  const route = useRoute();
  const { userUid } = route.params;
  const { docId } = route.params;
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [messagesCollectionRef, setMessagesCollectionRef] = useState(null);

  
  // console.log(docId);
  // console.log(userUid);
  useEffect(() => {
    // Fetch user data and set up messages collection reference
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, 'users', userUid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userDataFromFirebase = userDocSnap.data();
          setCurrentUserUid(userDataFromFirebase.uid);
          setUserData(userDataFromFirebase);

          // Set up the messages collection reference
          const messagesRef = collection(db, 'groupchat', docId, 'messages');
          setMessagesCollectionRef(messagesRef);
        } else {
          console.error('User document not found.');
        }

        setIsUserDataLoaded(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (messagesCollectionRef) {
      const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRealtimeMessages(messagesData);
      });
  
      return () => unsubscribe();
    }
    
    fetchData();
  }, [db, userUid, docId, messagesCollectionRef]);

  const sendMessage = async () => {
    try {
      // Check if userData is available and loaded before sending a message
      if (!userData || !isUserDataLoaded) {
        console.warn('UserData is not loaded yet. Cannot send message.');
        return;
      }
  
      await addDoc(messagesCollectionRef, {
        text: message,
        photo: photo,
        sender: userData.username,
        uid: userData.id,
        timestamp: serverTimestamp(),
      });
  
      setMessage('');
      setPhoto(null);
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
              <>
                <Appbar.Header style={{ backgroundColor: '#8AD1DB', height: 30, top: -15 }}>

                  <Text style={{ fontSize: 20, marginLeft: 15, top: -5, fontWeight: "bold" }}> {userData && userData.faculty}</Text>
                </Appbar.Header>
                <ScrollView style={{ flexGrow: 1, marginBottom: 80 }}>
                <View>
                <MaterialCommunityIcons 
                  name="account-group"  
                  size={40}
                  style={{ margin: 10, left: 180, marginTop: 20 }}
                />
              <Text style={{ textAlign: 'center', marginTop: 0, fontWeight:"bold",fontSize: 20 }}> {userData && userData.faculty}</Text>
              {realtimeMessages
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
          message.uid === userUid ? 320 : 0,
      }}>
        {message.sender}:</Text>
    <View
      key={index}
      style={{
        flexDirection: 'row',
        justifyContent:
          message.uid === userUid ? 'flex-end' : 'flex-start',
      }}
    >
      <View
  style={{
    backgroundColor: message.uid === userUid ? '#1C1441' : '#8AD1DB',
    padding: 10,
    borderRadius: 8,
    margin: 5,
    marginLeft: message.uid === userUid ? 50 : 0,
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

export default GroupChat;