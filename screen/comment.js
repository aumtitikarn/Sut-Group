import React, { useState, useEffect } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Avatar } from 'react-native-paper';

const Comment = () => {
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [postHomeData, setPostHomeData] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params.postId; 
  console.log(postId);

  useEffect(() => {
    // Function to fetch post data from Firestore
    const fetchPostData = async () => {
      try {
        const postRef = doc(FIRESTORE_DB, 'allpostHome', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          // Document exists, store the data in state
          setPostHomeData(postDoc.data());
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

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <MaterialCommunityIcons
          name="arrow-left-thick"
          size={50}
          style={{ margin: 10, top: 20 , left:10}}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View>
        {postHomeData && (
          <View>
            <Avatar.Icon icon="account-circle" size={50} style={{ top: 30, left: 30 , backgroundColor:'orange'}} color={'#FFF'} />
            <Image
              source={{ uri: postHomeData.profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 50, height:50, top: 30, left: 30 }}
            />
            <View style={{left:95, top: -15}}>
            <Text style={{ top: -5, fontWeight: 'bold' }}>{postHomeData.username}</Text>
            <Text style={{top: -5}}>#{postHomeData.faculty}</Text>
            <Text style={{ color: '#777267', top: -3 }}>{formatPostTime(postHomeData.timestamp)}</Text>
            </View>
            <Text style={{fontSize: 25, left: 30}}>{postHomeData.text}</Text>
          </View>
          
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffae8',
    paddingTop: StatusBar.currentHeight,
  },
});

export default Comment;
