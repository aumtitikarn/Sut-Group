import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../firestore';
import { addDoc,
    collection,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    query,
    orderBy
    } 
from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import CommentData from '../components/commentData';

const Comment = () => {
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const storage = FIREBASE_STORAGE;
  const [userData, setUserData] = useState('');
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState(null);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState('');
  const [username, setUsername] = useState(''); // เก็บค่า name ของผู้ใช้ที่เข้าสู่ระบบ
  const [faculty, setFaculty] = useState(''); // เก็บค่า faculty ของผู้ใช้ที่เข้าสู่ระบบ
  const [profileImg, setProfileImg] = useState(''); 
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params.postId; 
  const uidcom = route.params.uidcom; 
  // console.log(postId);

  const fetchUsers = async () => {
    try {
      const userUid = auth.currentUser.uid;
      const userCollectionRef = collection(db, 'users');
      const userDocRef = doc(userCollectionRef, userUid);

      // ใช้ onSnapshot เพื่อติดตามการเปลี่ยนแปลงในเอกสารของผู้ใช้
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserData(userData);
        }
      });

      // เพื่อคลุมครองการแบ่งปัน ต้องนำออกเมื่อคอมโพเนนต์ถูกคลุมครอง (unmounted)
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };
 

  useEffect(() => {
    const unsubscribe = fetchUsers();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    // Function to fetch post data from Firestore
    const fetchPostData = async () => {
      try {
        const postRef = doc(FIRESTORE_DB, 'allpostHome', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          // Document exists, store the data in state
          setPosts(postDoc.data());
        } else {
          // Document doesn't exist
          console.log('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData(); // Call the function to fetch post data
  }, [postId]);

  const formatPostTime = (timestamp) => {
    if (timestamp) {
      // ดึงค่าเวลาปัจจุบัน
      const now = new Date().getTime();
  
      // แปลง timestamp เป็น milliseconds ให้กับ JavaScript Date Object
      const postTime = new Date(timestamp.toDate());
  
      // คำนวณความต่างระหว่างเวลาปัจจุบันกับเวลาโพสต์
      const timeDifference = now - postTime.getTime();
  
      // แปลง milliseconds เป็นวินาที
      const seconds = Math.floor(timeDifference / 1000);
  
      // แปลงวินาทีเป็นนาที
      const minutes = Math.floor(seconds / 60);
  
      // แปลงนาทีเป็นชั่วโมง
      const hours = Math.floor(minutes / 60);
  
      // แปลงชั่วโมงเป็นวัน
      const days = Math.floor(hours / 24);
  
      if (days > 0) {
        return `เมื่อ ${days} วันที่แล้ว`;
      } else if (hours > 0) {
        return `เมื่อ ${hours} ชั่วโมงที่แล้ว`;
      } else if (minutes > 0) {
        return `เมื่อ ${minutes} นาทีที่แล้ว`;
      } else if (seconds > 0) {
        return `เมื่อ ${seconds} วินาทีที่แล้ว`;
      } else {
        return 'เมื่อไม่นานมานี้';
      }
    } else {
      return 'ไม่มีข้อมูลวันที่';
    }
  }
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

  const savecomment = async () => {
    try {
      const userUid = auth.currentUser.uid;
      if (userUid) {
        // สร้างค่า id สำหรับเอกสาร (เช่นตามเวลาปัจจุบัน)
        const id = Date.now().toString(); // หรือวิธีอื่น ๆ ที่คุณต้องการ
  
        const postHomeCollectionRef = collection(db, 'users', userUid, 'postHome',postId,'comment');
  
        // สร้างอ็อบเจกต์ข้อมูลโพสต์
        const post = {
          username: username,
          faculty: faculty,
          text: text,
          photo: photo,
          timestamp: serverTimestamp(),
          userUid: userUid,
          commentId: id,
          profileImg: profileImg
        };
  
        if (photo) {
          // แก้ไขชื่อรูปภาพให้เป็น id ของโพสต์
          const fileName = `${id}.jpg`;
        
          // อัปโหลดรูปภาพไปยัง Firebase Storage
          const storageRef = ref(storage, 'comment_post/' + fileName); // ต้องใช้ ref() แทน storage.ref()
        
          const response = await fetch(photo);
          const blob = await response.blob();
        
          await uploadBytes(storageRef, blob);
        
          // อัปเดตค่า 'photo' ด้วย URI ที่อ้างอิงจาก Firebase Storage
          const downloadURL = await getDownloadURL(storageRef);
          post.photo = downloadURL;
        }
  
        // ใช้ค่า id ในชื่อคอลเลกชัน 'allpostHome'
        const allpostHomeCollectionRef = collection(db, 'allpostHome',postId,'comment');
  
        // อัปเดตเอกสารในคอลเลกชัน 'allpostHome' ด้วยข้อมูลจาก 'post' object
        await setDoc(doc(allpostHomeCollectionRef, id), post);
        await setDoc(doc(postHomeCollectionRef, id), post);
        
  
        console.log("comment :", post);
        console.log('Document written with ID: ', id);
        setText('');
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
      {posts && (
            <View>
        <View>
          <MaterialCommunityIcons
            name="arrow-left-thick"
            size={50}
            style={{ margin: 10, top: 20, left: 10 }}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View>
              <Avatar.Icon
                icon="account-circle"
                size={50}
                style={{ top: 30, left: 30, backgroundColor: 'orange' }}
                color={'#FFF'}
              />
              <Image
                source={{ uri: posts.profileImg }}
                style={{
                  borderRadius: 50,
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  top: 30,
                  left: 30,
                }}
              />
              <View style={{ left: 95, top: -15 }}>
                <Text style={{ top: -5, fontWeight: 'bold', color: '#1C1441' }}>
                  {posts.username}
                </Text>
                <Text style={{ top: -5, color: '#1C1441' }}>#{posts.faculty}</Text>
                <Text style={{ color: '#777267', top: -3 }}>
                  {formatPostTime(posts.timestamp)}
                </Text>
              </View>
              <Text style={{ fontSize: 25, margin: 30, top: -30 , color: '#1C1441'}}>
                {posts.text}
              </Text>
              <Image
                source={{ uri: posts.photo }}
                style={{
                  width: 200,
                  height: 200,
                  left: 110,
                  top: -40,
                  resizeMode: 'cover',
                }}
              />
            </View>
            <View style={{top: posts.photo ? 160 : -40 }}>
            <View style={{ flexDirection: 'row',
              top: photo ? -175 : -165,
              left: 10}}>
            <TouchableOpacity onPress={camera}>
            <Icon name="camera" size={30} color="#1C1441" style={{margin :5}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openlib}>
            <Icon name="image" size={30} color="#1C1441" style={{margin :5}} />
            </TouchableOpacity >
            </View>
          <View name="1"
          style={{
            borderBottomColor: "black", 
            borderBottomWidth: 2, 
            alignSelf:'stretch',
            width: "100%",
            top: photo ? -230 : -150
            }}/>
            {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 110,top: -170, margin: 10 }} />}
        <View style={{top: -150, left: 150}}>
        <View style={{flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          top: photo ? -200 : -70,
          left: -10,}}>
              <TextInput
                placeholder="เขียนคอมเมนต์ของคุณ..."
                style={styles.commentInput}
                value={text}
                onChangeText={(text) => setText(text)}
              />
              <Image
                source={{ uri: userData.profileImg }}
                style={{
                  borderRadius: 50,
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  top: 20,
                  left: -30,
                }}/>
              <TouchableOpacity style={styles.commentButton} onPress={savecomment}>
              <Text style={{ color: '#000' }}>ส่ง</Text>
              </TouchableOpacity>
              </View>
              <View name="2"
          style={{
            borderBottomColor: "black", 
            borderBottomWidth: 2, 
            alignSelf:'stretch',
            width: "100%",
            top: photo ? -70 : -120,
            left: -150
            }}/>
          </View>
          <View style={{ top: photo ? -220 : -202}}>
          <CommentData post={posts}/>
          </View>
          </View>
          </View>
          )} 

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF4E2',
    paddingTop: StatusBar.currentHeight,
  },
  commentInput: {
    width: 230,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingLeft: 50,
    paddingVertical: 10,
    left: -60,
    top:10,
    backgroundColor: '#FFF',
    borderWidth: 1
  },
  commentButton: {
    backgroundColor: '#8AD1DB',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    left: -50,
    top:10,
    borderColor: 'black',
    borderWidth: 1
  },
});

export default Comment;