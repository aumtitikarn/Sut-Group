import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'; // Import Firestore functions for fetching data
import Icon from 'react-native-vector-icons/FontAwesome';
import UserProfile from './userPost';
import { Avatar } from 'react-native-paper';
import { FIREBASE_AUTH } from '../firestore';

const Home = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
    
      try {
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        console.log('Fetched user data:', userData); // Add this line
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };
    
    // Inside the `fetchPosts` function
    const fetchPosts = async () => {
      const usersCollectionRef = collection(db, 'users');
      const allUserPosts = [];
    
      try {
        const querySnapshot = await getDocs(usersCollectionRef);
        for (const userDoc of querySnapshot.docs) {
          const postHomeCollectionRef = collection(userDoc.ref, 'postHome');
          const postHomeQuerySnapshot = await getDocs(postHomeCollectionRef);
          console.log('Fetched posts for user:', userDoc.id, postHomeQuerySnapshot.docs.map((postDoc) => postDoc.data()));
    
          postHomeQuerySnapshot.forEach((postDoc) => {
            const postData = postDoc.data();
            const userData = { username: userDoc.data().username, faculty: userDoc.data().faculty };
            allUserPosts.push({ userId: userDoc.id, ...postData, userData });
          });
        }
        console.log('All user posts:', allUserPosts);
        setPosts(allUserPosts); // Ensure this is called
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };
    fetchUserData();
    fetchPosts();
  }, []); 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <View>
              <View style={{
                top: -40,
                left: -100
              }}>
                <Avatar.Icon icon="account-circle" size={50} style={{ top: 30, left: 90 }} />
              </View>
              <View style={styles.userDataContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}> {post.userData.username}</Text>
                <View>
                  <Text style={styles.userDataText}> #{post.userData.faculty}</Text>
                </View>
              </View>
            </View>
            <View style={{ top: -40 }}>
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
    margin: 10
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
  userDataContainer: {
    top: -60,
    left: 50
  },
  userDataText: {
    fontSize: 14,
    padding: 5
  },
});

export default Home;
