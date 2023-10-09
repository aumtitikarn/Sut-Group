import React, { useState, useEffect, useRef } from 'react';
import { View,
   Text,  
   SafeAreaView, 
   StyleSheet, 
   TextInput, 
   TouchableOpacity,
   StatusBar,
   Image,
  Platform,
  Alert, } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIRESTORE_DB, FIREBASE_STORAGE } from '../firestore';
import { addDoc,
    collection,
    serverTimestamp,
    } from 'firebase/firestore';
    import * as ImagePicker from 'expo-image-picker';

const Home = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [photo, setPhoto] = useState(null);
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;

  //โพสต์ข้อความ

  const handlePost = async () => {
      try {
  
        const docRef = await addDoc(collection(db, 'post'), {
          text: feed,
          timestamp: serverTimestamp(),
          photo: photo, // Include the 'photo' state in the Firestore document
        });
  
        console.log('Document written with ID: ', docRef.id);
        setFeed('');
        setPhoto(null); // Clear the 'photo' state after posting
      } catch (error) {
        console.error('Error adding document: ', error);
      }
  };

  // เข้าถึงกล้อง

  const camera = async () => {
    console.log('PRESSS =====>');
    const result = await launchCamera({saveToPotos:true});
    setPhoto(result?.assets[0]?.uri);
    console.log('RESULT ====>', result);
  };

  // เข้าถึงคลังรูปภาพ
  const openlib = async () => {
    // No permissions request is necessary for launching the image library
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
    <SafeAreaView style={styles.container}>
    <View>
    <MaterialCommunityIcons 
      name="arrow-left-thick"  
      size={50} style={{margin:10}} 
      onPress={() => navigation.navigate('Home')} 
      />
    </View>
      <View
   style={{
      top: 10,
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={80} />
    </View>
     <View
   style={{
     top: -60,
      left: 110, 
    }}>
      <TextInput
        style={styles.input}
        placeholder="คุณกำลังคิดอะไรอยู่..."
        placeholderTextColor="Gray"
        textAlignVertical="top" 
        multiline={true}
        value={feed}
        onChangeText={(text) => setFeed(text)}
      />
    </View>
    <View style={styles.selectedImage}>
    {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 10,top: -50 }} />}
    </View>
    <View style={styles.iconContainer}>
    <Icon name="camera" size={20} color="#000" style={styles.icon} onPress={camera}/>
    <Icon name="image" size={20} color="#000" style={styles.icon} onPress={openlib}/>
    <Icon name="map-marker" size={20} color="#000" style={styles.icon} />
    </View>
    <View style={{
      top: -80,
      left: 275
    }}>
    <TouchableOpacity style={styles.buttonYellow}>
      <Text style={styles.buttonText} onPress={handlePost}>โพสต์</Text>
    </TouchableOpacity>
    </View>
      
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
    paddingTop: StatusBar.currentHeight 
  },
   input: {
    height: 200,
    width: 275,
    borderWidth: 1,
    borderRadius:10,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  iconContainer: {
    flexDirection: 'row', // จัดเรียงแนวนอน
    alignItems: 'center', // จัดวางไอคอนให้ตรงกลาง
    top:-50,
    marginLeft: 105
  },
  icon: {
    marginRight: 10, // ระยะห่างระหว่างไอคอน
  },
   buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 100,
    padding:5,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    margin: 5
  },
  selectedImage: {
    width: 200, // Adjust the width and height as needed
    height: 110,
    alignSelf: 'center', // Center the image horizontally
  },
});
export default Home;