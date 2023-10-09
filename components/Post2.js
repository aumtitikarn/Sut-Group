import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView
} from 'react-native';
import { FIRESTORE_DB } from '../firestore'; // Import your Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions for fetching data
import { Avatar, Card, IconButton } from 'react-native-paper';

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
            {post.photo && (
              <Image source={{ uri: post.photo }} style={styles.postImage} />
            )}
            <Text style={styles.postText}>{post.text}</Text>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
});

export default Home;