import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc,deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Share = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [isLiked, setIsLiked] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userUid = auth.currentUser.uid;
    const q = query(collection(db, 'users', userUid, 'share'), orderBy('timeshare', 'desc'));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = [];
      const updatedIsLiked = {};
      const updatedLikeCount = {};
  
      snapshot.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        updatedPosts.push(post);
        updatedIsLiked[post.id] = false;
        updatedLikeCount[post.id] = post.like;
      });
  
      setPosts(updatedPosts);
      setIsLiked(updatedIsLiked);
      setLikeCount(updatedLikeCount);
    });
  
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const updateLike = async (post) => {
    try {
      const userUid = auth.currentUser.uid;
      const postRef = doc(db, 'users', userUid, 'share', post.id);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const likedBy = postDoc.data().likedBy || [];

        if (likedBy.includes(userUid)) {
          const updatedLikedBy = likedBy.filter((uid) => uid !== userUid);
          const newLikeCount = Math.max(post.like - 1, 0);

          const updateData = {
            likedBy: updatedLikedBy,
            like: newLikeCount,
          };

          await updateDoc(postRef, updateData);

          if (post.id in isLiked) {
            setIsLiked((currentIsLiked) => ({
              ...currentIsLiked,
              [post.id]: false,
            }));
          }
          // อัปเดตข้อมูลการไลค์ไปยังคอลเลคชัน "postHome" ใน Firestore
          await updateLikeInPostHome(userUid, post.id, updatedLikedBy, newLikeCount);
        } else {
          const updatedLikedBy = [...likedBy, userUid];
          const newLikeCount = post.like + 1;

          const updateData = {
            likedBy: updatedLikedBy,
            like: newLikeCount,
          };

          await updateDoc(postRef, updateData);

          if (post.id in isLiked) {
            setIsLiked((currentIsLiked) => ({
              ...currentIsLiked,
              [post.id]: true,
            }));
          }
          // อัปเดตข้อมูลการไลค์ไปยังคอลเลคชัน "postHome" ใน Firestore
          await updateLikeInPostHome(userUid, post.id, updatedLikedBy, newLikeCount);
        }
      } else {
        console.error('ไม่พบข้อมูลโพสต์: ', post.id);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการกดไลค์: ', error);
    }
  };

  const updateLikeInPostHome = async (userUid, postId, likedBy, likeCount) => {
    const postHomeRef = doc(db, 'users', userUid, 'share', postId);

    const postHomeDoc = await getDoc(postHomeRef);
    if (postHomeDoc.exists()) {
      const updateData = {
        likedBy: likedBy,
        like: likeCount,
      };

      await updateDoc(postHomeRef, updateData);
    }
  };

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
  };

  

  const handleDeletePost = async (postId) => {
    try {
      const userUid = auth.currentUser.uid;
  
      // 1. ลบโพสต์จาก "postHome" collection ใน Firestore
      const postHomeRef = doc(db, 'users', userUid, 'share', postId);
      await deleteDoc(postHomeRef);
  
      console.log('ลบโพสต์สำเร็จ');ห
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบโพสต์: ', error);
    }
  };

  
  //-------------------------------------------------------------------------------------//

  return (
    <SafeAreaView style={styles.container}>
  <ScrollView>
    {posts.map((post) => (
      <View key={post.id} style={styles.postContainer}>
        <View style={{ top: -70, left: 55, width:230}}>
        <Avatar.Icon icon="account-circle" size={50} style={{ top: 55, left: -70 , backgroundColor:'orange'}} color={'#FFF'} />
          <Image
              source={{ uri: post.profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 50, height:50, left: -70, top: 55 }}
            />
          <Text style={{ top: 10, fontWeight: 'bold', left: -5 }}>{post.username}</Text>
          <Text style={styles.userData}>#{post.faculty}</Text>
          <Text style={{ color: '#777267', top: 15, left: -5 }}>{formatPostTime(post.timestamp)}</Text>
        </View>
        <View style={{ top: -50, left: 30 }}>
          <Text style={styles.postText}>{post.text}</Text>
          {post.photo && (
            <Image source={{ uri: post.photo }} style={styles.postImage} />
          )}
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => updateLike(post)}>
            <Icon
              name={isLiked[post.id] ? 'heart' : 'heart'}
              size={25}
              color={isLiked[post.id] ? 'orange' : '#000'}
              style={{ marginLeft: 30 }}
            />
          </TouchableOpacity>
          <View>
            <Text style={{ left: 20 }}>{likeCount[post.id]}</Text>
          </View>
          <TouchableOpacity>
            <Icon name="comment" size={25} color="#000" style={{ marginLeft: 50, top: -3 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="share" size={25} color="orange" style={{ marginLeft: 60, top: -2 }} onPress={() => handleDeletePost(post.id)}/>
          </TouchableOpacity>
        </View>
      </View>
    ))}
  </ScrollView>
</SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff5e8',
},
postContainer: {
  borderWidth: 1,
  borderColor: '#000',
  backgroundColor: '#ffebce',
  margin: 15,
  borderRadius: 50,
  overflow: 'hidden',
  padding: 30,
},

postImage: {
  width: 200,
  height: 200,
  resizeMode: 'cover',
  left: 30,
  top: 10
},
postText: {
  fontSize: 25,
  left: -10,
  marginTop: 20
},
iconContainer: {
  flexDirection: 'row',
  paddingHorizontal: 20,
  alignItems: 'center',
  top: -25,
  left: 15
},
userData: {
  top: 10,
  left: -5
},
dropdown: {
  position: 'absolute',
  top: 30, // ปรับตำแหน่ง Dropdown ตามความเหมาะสม
  right: 0, // ปรับตำแหน่ง Dropdown ตามความเหมาะสม
  backgroundColor: '#FFF', // สีพื้นหลังของ Dropdown
  borderWidth: 1, // หรือคุณสามารถใช้ shadow แทน
  borderColor: '#000', // สีขอบของ Dropdown
  padding: 5,
  zIndex: 1, // คุณอาจต้องกำหนด zIndex เพื่อให้ Dropdown อยู่เหนือกับเนื้อหาอื่น
  borderRadius: 10,
  top: 20,
  marginRight:70,
  backgroundColor: '#fff5e2'
},
});
  
export default Share;