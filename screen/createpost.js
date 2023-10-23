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
    doc,
    getDoc,
    setDoc
    } 
from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_AUTH } from '../firestore';

const createpost = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [like, setLike] = useState('');
  const [comment, setComment] = useState('');
  const [share, setShare] = useState('');
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState(''); // เก็บค่า name ของผู้ใช้ที่เข้าสู่ระบบ
  const [faculty, setFaculty] = useState(''); // เก็บค่า faculty ของผู้ใช้ที่เข้าสู่ระบบ
  const [profileImg, setProfileImg] = useState(''); 
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const userUid = auth.currentUser?.uid;
    if (userUid) {
      const userCollectionRef = collection(db, 'users');
      const userDocRef = doc(userCollectionRef, userUid);
  
      getDoc(userDocRef)
        .then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User Data:', userData);
            setUsername(userData.username);
            setFaculty(userData.faculty);
            setProfileImg(userData.profileImg);
            console.log('Name:', username);
        console.log('Faculty:', faculty);
          } else {
            console.error('User document does not exist.');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
    }
  }, [auth.currentUser]);

  // ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ


  const handlePost = async () => {
    try {
      const userUid = auth.currentUser?.uid;
      if (userUid) {
        // สร้างค่า id สำหรับเอกสาร (เช่นตามเวลาปัจจุบัน)
        const id = Date.now().toString(); // หรือวิธีอื่น ๆ ที่คุณต้องการ
  
        const postHomeCollectionRef = collection(db, 'users', userUid, 'postHome');
  
        // สร้างอ็อบเจกต์ข้อมูลโพสต์
        const post = {
          username: username,
          faculty: faculty,
          text: feed,
          timestamp: serverTimestamp(),
          userUid: userUid,
          postid: id,
          like: 0,
          profileImg: profileImg
        };
  
        if (photo) {
          // แก้ไขชื่อรูปภาพให้เป็น id ของโพสต์
          const fileName = `${id}.jpg`;
        
          // อัปโหลดรูปภาพไปยัง Firebase Storage
          const storageRef = ref(storage, 'photo_post/' + fileName); // ต้องใช้ ref() แทน storage.ref()
        
          const response = await fetch(photo);
          const blob = await response.blob();
        
          await uploadBytes(storageRef, blob);
        
          // อัปเดตค่า 'photo' ด้วย URI ที่อ้างอิงจาก Firebase Storage
          const downloadURL = await getDownloadURL(storageRef);
          post.photo = downloadURL;
        }
  
        // ใช้ค่า id ในชื่อคอลเลกชัน 'allpostHome'
        const allpostHomeCollectionRef = collection(db, 'allpostHome');
  
        // อัปเดตเอกสารในคอลเลกชัน 'allpostHome' ด้วยข้อมูลจาก 'post' object
        await setDoc(doc(allpostHomeCollectionRef, id), post);
        await setDoc(doc(postHomeCollectionRef, id), post);
  
        navigation.navigate('Home');
        console.log('Document written with ID: ', id);
        setFeed('');
        setPhoto(null);
      }
    } catch (error) {
      console.error('Error adding document: ', error);
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
    <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor:'orange'}} color={'#FFF'} />
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
    {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 110,top: -50, margin: 10 }} />}
    <View style={styles.iconContainer}>
    <Icon name="camera" size={20} color="#000" style={styles.icon} onPress={camera}/>
    <Icon name="image" size={20} color="#000" style={styles.icon} onPress={openlib}/>
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
    backgroundColor: '#fffae8',
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
    flexDirection: 'row',
    alignItems: 'center', 
    top:-50,
    marginLeft: 105
  },
  icon: {
    marginRight: 10,
  },
   buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 100,
    padding:5,
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 5
  },
  selectedImage: {
    width: 200,
    height: 110,
    alignSelf: 'center', 
  },
});
export default createpost;