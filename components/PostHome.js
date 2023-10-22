import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore';
import { collection, query, orderBy, onSnapshot, doc, updateDoc,getDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [isLiked, setIsLiked] = useState([]);
  const [likeCount, setLikeCount] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'allpostHome'), orderBy('timestamp', 'desc'));

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
  }, []);

  const updateLike = async (post) => {
    try {
      const userUid = auth.currentUser.uid;
      const postRef = doc(db, 'allpostHome', post.id);
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
    const postHomeRef = doc(db, 'users', userUid, 'postHome', postId);
    
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
}
  
<<<<<<< HEAD
return (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      {posts.map((post) => (
        <View key={post.id} style={styles.postContainer}>
          <View style={{ top: -50, left: 55 }}>
            <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 , backgroundColor:'orange'}} color={'#FFF'} />
            <Image
              source={{ uri: post.profileImg }}
              style={{ width: 50, height: 50, left: -60, top: 40, borderRadius: 50, position: 'absolute' }}
            />
            <Text style={{ top: -5, fontWeight: 'bold' }}>{post.username}</Text>
            <Text style={styles.userData}>#{post.faculty}</Text>
            <Text style={{ color: '#777267' }}>{formatPostTime(post.timestamp)}</Text>
          </View>
          <View style={{ top: -50, left: 30 }}>
            <Text style={styles.postText}>{post.text}</Text>
            {post.photo && (
              <Image source={{ uri: post.photo }} style={styles.postImage} />
            )}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => updateLike(post)}>
=======
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {posts.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <View style={{ top: -50, left: 70 }}>
              <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 }} />
              <Text style={{ top: -5, fontWeight: 'bold' }}>{post.username}</Text>
              <Text style={styles.userData}>#{post.faculty}</Text>
              <Text style={{color: '#777267'}}>{formatPostTime(post.timestamp)}</Text>
            </View>
            <View style={{ top: -30, left: 30 }}>
              <Text style={styles.postText}>{post.text}</Text>
              {post.photo && (
                <Image source={{ uri: post.photo }} style={styles.postImage} />
              )}
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => updateLike(post)}>
>>>>>>> 772af14c901de55bfed7b5d579fafbb5b7654f0f
              <Icon
              name={isLiked[post.id] ? 'heart' : 'heart-o'}
              size={30}
              color={isLiked[post.id] ? 'orange' : '#000'}
              />
            </TouchableOpacity>
            <View>
            <Text style={{top: 25, left:-73}}>{likeCount[post.id]}</Text>
            </View>
              <TouchableOpacity>
                <Icon name="comment-o" size={30} color="#000" style={{ left:-20}} />
              </TouchableOpacity>
              <TouchableOpacity>
              <MaterialCommunityIcons name='share-outline' color="#000" size={40}  />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
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
  padding: 20,
},
postImage: {
  width: 200,
  height: 200,
  resizeMode: 'cover',
  left: 30,
  top:20
},
postText: {
  fontSize: 25,
  left: -10,
  top: 15
},
iconContainer: {
  flexDirection: 'row',
  paddingHorizontal: 20,
  alignItems: 'center',
  top: -10,
  left: 15
},
userData: {
  top: -5,
},
=======
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FBE5AD',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    margin: 20,
    borderRadius: 50,
    overflow: 'hidden',
    padding: 30,
  },
  postImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    margin: 10,
  },
  postText: {
    fontSize: 28,
    fontWeight: 'bold',
    left: -10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    top: -5,
  },
  userData: {
    top: -5,
  },
>>>>>>> 772af14c901de55bfed7b5d579fafbb5b7654f0f
});

export default Home;
