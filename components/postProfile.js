import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore';
import { collection, getDocs, doc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIREBASE_AUTH } from '../firestore';
import UserProfile from './userPost';

const Home = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    // สร้างคอลเลคชันอ้างอิง
    const userUid = auth.currentUser.uid;
    const userCollectionRef = collection(db, 'users');
    const userDocRef = doc(userCollectionRef, userUid);
    const postHomeCollectionRef = collection(userDocRef, 'postHome');
    
    // สร้างคิวรี่เพื่อดึงโพสต์ที่มีการจัดเรียงตามเวลาล่าสุด
    const q = query(postHomeCollectionRef, orderBy('timestamp', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedPosts = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        updatedPosts.push(postData);
      });
      setPosts(updatedPosts);
    });

    return () => {
      // ยกเลิกการติดตามเมื่อออกจากหน้า Home
      unsubscribe();
    };
  }, []);

  // ควรอัปเดต state ให้รองรับการเพิ่มโพสต์ใหม่แล้วทำการอัปเดต UI ในส่วนนี้

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <View style={{ top: -50, left: 70 }}>
              <UserProfile />
            </View>
            <View style={{ alignItems: 'center', top: -40 }}>
              <Text style={styles.postText}>{post.text}</Text>
              {post.photo && (
                <Image source={{ uri: post.photo }} style={styles.postImage} />
              )}
            </View>
            <View style={styles.iconContainer}>
              <Icon name="heart" size={30} color="#000" style={styles.icon} />
              <Icon name="comment" size={30} color="#000" style={styles.icon} />
              <Icon name="share" size={30} color="#000" style={styles.icon} />
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
  },
  postText: {
    fontSize: 28,
    fontWeight: 'bold',
    left: -65
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    top: 10
  },
});

export default Home;
