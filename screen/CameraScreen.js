import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../firestore';
import { addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  onSnapshot
  } 
from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const intervalRef = useRef(null); // Add this line
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [username, setUsername] = useState(''); 
  const [profileImg, setProfileImg] = useState(''); 
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      // Set the captured image and stop recording if it's ongoing
      setCapturedImage(photo);
      setIsRecording(false);

      // Clear the interval when taking a picture
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const refreshCamera = () => {
    // Clear the captured image
    setCapturedImage(null);

    // If recording, stop recording
    if (isRecording) {
      stopRecording();
    }

    // Reset elapsed time
    setElapsedTime(0);
  };

  const sentStory = async () => {
    if (capturedImage) {
      const user = auth.currentUser;
      const uid = user.uid;
  
      try {
        // Correct the collection reference construction
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const username = userData.username || 'Anonymous';
          const profileImg = userData.profileImg || null;
  
          // Upload the image to Firestore 'Story' collection
          await uploadImage(capturedImage.uri, uid, username, profileImg);
  
          navigation.navigate('Home');

          refreshCamera();
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user information:', error.message);
      }
    }
  };
  
  const uploadImage = async (uri, uid, username, profileImg) => {
    try {
      // Generate a unique filename for the image
      const filename = `${uid}_${new Date().getTime()}.jpg`;
  
      // Create a reference to the storage service
      const storageRef = ref(storage, `Story/${filename}`);
  
      // Convert the image to a Uint8Array to upload it
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // Upload the image using uploadBytes
      await uploadBytes(storageRef, blob);
  
      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
  
      // Add the image details to the Firestore collection 'Story'
      const storyRef = collection(db, 'Story');
      await addDoc(storyRef, {
        uri: downloadURL,
        timestamp: serverTimestamp(),
        uid: uid,
        profileImg: profileImg,
        username: username,
      });
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };
  
  
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
      >
        <MaterialCommunityIcons 
          name="arrow-left"  
          size={35} style={{margin:15, position: 'absolute', color: 'white'}} 
          onPress={() => navigation.navigate('Home')} 
        />
        <View>
          <TouchableOpacity style={styles.Flipbutton} onPress={flipCamera}>
            <MaterialCommunityIcons name="camera-flip-outline" color={'white'} size={50} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <MaterialCommunityIcons name="radiobox-marked" color={'white'} size={100} />
          </TouchableOpacity>

          {/* Display the elapsed time during video recording */}
          {isRecording && (
            <Text style={styles.elapsedTimeText}>{`Time: ${elapsedTime} seconds`}</Text>
          )}
        </View>
      </Camera>

      {capturedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.refreshButton} onPress={refreshCamera}>
            <MaterialCommunityIcons name="refresh" color={'black'} size={35} style={{top:5, left:10}} />
            <Text style={{fontWeight:'bold', fontSize:18, top:-25, left:50}}>ถ่ายอีกครั้ง</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sentStory} onPress={sentStory}>
            <MaterialCommunityIcons name="arrow-up" color={'black'} size={35} style={{margin:9}} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    camera: {
      flex: 1,
    },
    Flipbutton: {
      left: 330,
      top: 720,
      position: 'absolute',
    },
    captureButton: {
      left: 155,
      top: 700,
      position: 'absolute',
    },
    elapsedTimeText: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
    },
    previewContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'white',
    },
    refreshButton: {
      position: 'absolute',
      top: 50, // Adjust the top value as needed
      left: 20, // Adjust the left value as needed
      backgroundColor: 'white',
      width:150 ,
      height:40,
      borderRadius:50
    },
    sentStory: {
      position: 'absolute',
    top: 800, // Adjust the top value as needed
    left: 190, // Adjust the left value as needed
    backgroundColor: 'white',
    borderRadius: 50, // Half of width and height to create a circle
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    }
  });
  
  export default CameraScreen;