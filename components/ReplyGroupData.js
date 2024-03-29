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
import { onSnapshot, query, orderBy, collection, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReplyGroupData = ({comments, DocName}) => {
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const storage = FIREBASE_STORAGE;
  const [comment, setComment] = useState([]);
  const navigation = useNavigation();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const route = useRoute();
  const postId = route.params.postId;
  const commentItem = route.params.comment; 
// console.log('commentId : ',commentItem);
// console.log('postId : ',postId);
console.log("DocName",DocName);
  

  useEffect(() => {
    const q = query(collection(FIRESTORE_DB, 'groupPost', DocName, 'posts', postId, 'comment', commentItem ,'reply'), orderBy('timestamp', 'desc'));

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
  }, [postId, commentItem]);

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

  const handleIconBarsPress = (post) => {
    return post.userUid === auth.currentUser?.uid;
  };
  const toggleDropdown = (postId) => {
    if (selectedPostId === postId) {
      // ถ้าโพสต์ถูกเลือกแล้วให้ปิด Dropdown
      setSelectedPostId(null);
    } else {
      // ถ้าโพสต์ยังไม่ถูกเลือกให้เปิด Dropdown ของโพสต์นี้
      setSelectedPostId(postId);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      // Construct the path to the comment document in the reply collection.
      const replyCommentRef = doc(FIRESTORE_DB, 'groupPost', DocName, 'posts', postId, 'comment', commentItem, 'reply', commentId);
  
      // Delete the comment document in the reply collection.
      await deleteDoc(replyCommentRef);
  
      // You can also update the state to reflect the deleted comment.
      // Here's a simple example to remove the deleted comment from the state.
      setComment((prevComment) => prevComment.filter((comment) => comment.id !== commentId));
  
      console.log('Comment deleted successfully.');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };


  return (
    <SafeAreaView style={{
    backgroundColor: '#8AD1DB',
    height: comments.photo ? 318 : 520}}>
      <ScrollView>
          {comment.map((commentItem) => (
            <View key={commentItem.id}  
            style={{backgroundColor: '#FDF4E2',
            padding: 8,
            borderWidth: 2,
            borderRadius: 10,
            margin: 5,
            height: commentItem.photo ? 230 : 110}}>
            {handleIconBarsPress(commentItem) && (
          <TouchableOpacity onPress={() => toggleDropdown(commentItem.id)} style={{ right: 10, top: 10, position: 'absolute', zIndex: 1 }}>
            <Icon name="bars" size={23} color="#000" />
          </TouchableOpacity>
        )}
        {selectedPostId === commentItem.id && handleIconBarsPress(commentItem) && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => handleDeleteComment(commentItem.id)}>
              <Text style={{ color: '#442f04', top: -2 }}>ลบคอมเมนต์</Text>
            </TouchableOpacity>
          </View>
        )}
              <Avatar.Icon
                icon="account-circle"
                size={50}
                style={{ backgroundColor: '#1C1441' }}
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
                <Text style={{ color: '#1C1441' }}>{commentItem.faculty}</Text>
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
  dropdown: {
    position: 'absolute',
    backgroundColor: '#FFF', // สีพื้นหลังของ Dropdown
    borderWidth: 1, // หรือคุณสามารถใช้ shadow แทน
    borderColor: '#000', // สีขอบของ Dropdown
    padding: 8,
    zIndex: 1, // คุณอาจต้องกำหนด zIndex เพื่อให้ Dropdown อยู่เหนือกับเนื้อหาอื่น
    borderRadius: 10,
    marginRight:70,
    backgroundColor: '#ffd803',
    top: 10,
    left: 270
  },
});


export default ReplyGroupData;