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
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../firestore';
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore';


const CommentData = () => {
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const storage = FIREBASE_STORAGE;
  const [comment, setComment] = useState([]);
  const [comments, setComments] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params.postId;

  

  useEffect(() => {
    const q = query(collection(db, 'allpostHome', postId, 'comment'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedcomment = [];

      snapshot.forEach((doc) => {
        const commentData = { id: doc.id, ...doc.data() };
        updatedcomment.push(commentData);
      });

      setComment(updatedcomment);
    });

    return () => {
      unsubscribe();
    };
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
      <ScrollView>
          {comment.map((commentItem) => (
            <View key={commentItem.id}  
            style={{backgroundColor: '#FDF4E2',
            padding: 8,
            borderWidth: 2,
            borderRadius: 10,
            margin: 5,
            top: -5,
            height: commentItem.photo ? 230 : 110}}>
              <TouchableOpacity 
              style={{borderWidth:1, 
                left: 320, 
                top: commentItem.photo ? 180 : 60, 
                borderRadius: 2,
                backgroundColor: "#8AD1DB",
                position: "absolute", 
                padding : 5,
                }} 
                onPress={() =>
                  navigation.navigate('Reply', {
                    comment: commentItem.id,
                    postId: postId, 
                  })
                }
              >
            <Text style={{color:"#1C1441"}}>ตอบกลับ</Text>
          </TouchableOpacity>
              <Avatar.Icon
                icon="account-circle"
                size={50}
                style={{ backgroundColor: 'orange' }}
                color={'#FFF'}
              />
              <Image
                source={{ uri: commentItem.profileImg }}
                style={{ borderRadius: 50, position: 'absolute', width: 50, height: 50,top: 8, left: 8 }}
              />
              <View style={{ left: 65, top: -50 }}>
                <Text style={{ fontWeight: 'bold', color: '#1C1441' }}>
                  {commentItem.username}
                </Text>
                <Text style={{ color: '#1C1441' }}>#{commentItem.faculty}</Text>
                <Text style={{ color: '#777267' }}>
                  {formatPostTime(commentItem.timestamp)}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: '#1C1441', top: -40 }}>
                {commentItem.text}
              </Text>
              {commentItem.photo && (
                <Image
                  source={{ uri: commentItem.photo }}
                  style={{
                    width: 100,
                    height: 100,
                    margin: 10,
                    top: -40,
                    left: -10
                  }}
                />
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight,
    height: 500,
  },
});

export default CommentData;