import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore';
import { collection, getDocs, doc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIREBASE_AUTH } from '../firestore';
import UserProfile from './userPost';
import { Avatar } from 'react-native-paper';

const Home = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    // สร้างคิวรีสำหรับคอลเลคชัน "allpostHome" และเรียกใช้ onSnapshot
    const q = query(collection(db, 'allpostHome'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = [];
      snapshot.forEach((doc) => {
        updatedPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(updatedPosts);
    });

    return () => {
      // ยกเลิกการสั่งสอบถามเมื่อคอมโพนเมนต์ถูกถอนออก
      unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <View style={{ top: -50, left: 70 }}>
            <Avatar.Icon icon="account-circle" size={50} style={{top : 40, left: -60}} />
            <Text style={{top:-5, fontWeight: 'bold'}}>{post.name}</Text>
            <Text style={styles.userData}>#{post.faculty}</Text>
            </View>
            <View style={{ top: -30, left: 30 }}>
              <Text style={styles.postText}>{post.text}</Text>
              {post.photo && (
                <Image source={{ uri: post.photo }} style={styles.postImage} />
              )}
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity>
              <Icon name="heart" size={30} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon name="comment" size={30} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon name="share" size={30} color="#000" style={styles.icon} />
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
    margin:10
  },
  postText: {
    fontSize: 28,
    fontWeight: 'bold',
    left: -10
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    top: 10
  },
  userData: {
    top:-5 
  }
});

export default Home;
