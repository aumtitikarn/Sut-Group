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
    onSnapshot
    } 
from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Comment = () => {
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [posts, setPosts] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params.postId; 
  // console.log(postId);

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
      <ScrollView>
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
            <View style={styles.icon}>
            <Icon name="camera" size={30} color="#1C1441" style={{margin :5}} />
            <Icon name="image" size={30} color="#1C1441" style={{margin :5}} />
            </View>
          <View
          style={{
            borderBottomColor: "black", 
            borderBottomWidth: 1, 
            alignSelf:'stretch',
            width: "100%",
            top: -150
            }}/>
        <View style={{top: -150, left: 150}}>
        <View style={styles.commentContainer}>
              <TextInput
                placeholder="เขียนคอมเมนต์ของคุณ..."
                style={styles.commentInput}
              />
              <Image
                source={{ uri: posts.profileImg }}
                style={{
                  borderRadius: 50,
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  top: 20,
                  left: -30,
                }}/>
              <TouchableOpacity style={styles.commentButton}>
              <Text style={{ color: '#fff' }}>ส่ง</Text>
              </TouchableOpacity>
              </View>
              <View
          style={{
            borderBottomColor: "black", 
            borderBottomWidth: 1, 
            alignSelf:'stretch',
            width: "100%",
            top: -120,
            left: -150
            }}/>
          </View>
          </View>
          </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF4E2',
    paddingTop: StatusBar.currentHeight,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    top: -70, // ตำแหน่งคอมเมนต์ Input
    left: -10
  },
  commentInput: {
    width: 230,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingLeft: 50,
    paddingVertical: 10,
    left: -60,
    top:10,
    backgroundColor: '#FFF'
  },
  commentButton: {
    backgroundColor: '#1C1441',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    left: -50,
    top:10,
    borderColor: 'black'
  },
  icon: {
    flexDirection: 'row',
    top: -165,
    left: 10
  }
});

export default Comment;