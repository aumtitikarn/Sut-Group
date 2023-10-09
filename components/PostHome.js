import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions for fetching data
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [photo, setPhoto] = useState(null);
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const db = FIRESTORE_DB;

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'post'));
      const postsData = [];

      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        postsData.push(postData);
      });

      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <Text style={styles.postText}>{post.text}</Text>
            {post.photo && (
              <Image source={{ uri: post.photo }} style={styles.postImage} />
            )}
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
    // Add your styles here
  },
  postContainer: {
    borderWidth: 1, // Use "borderWidth" instead of "border"
    borderColor: '#000', // Set the border color
    backgroundColor: '#FBE5AD',
    shadowColor: 'rgba(0, 0, 0, 0.25)', // Set shadow color
    shadowOffset: { width: 0, height: 4 }, // Set shadow offset
    shadowRadius: 4, // Set shadow radius
    elevation: 4, // Add elevation for Android
    margin: 20,
    borderRadius: 50, // Set borderRadius to 50
    overflow: 'hidden', // Hide content outside the borderRadius
    padding: 40,
  },
  postImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
    // Add your text styles here
  },
  iconContainer: {
    flexDirection: 'row', // จัดเรียงแนวนอน
    justifyContent: 'space-between', // กระจายไอคอนให้เท่ากัน
    paddingHorizontal: 20, // ระยะห่างด้านข้าง
    alignItems: 'center', // จัดวางไอคอนให้ตรงกลาง
    top:30
  },
});

export default Home;