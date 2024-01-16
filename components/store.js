import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firestore';
import { Avatar } from 'react-native-paper';

const Store = () => {
  const navigation = useNavigation();
  const [storyInfo, setStoryInfo] = useState([]);
  const db = FIRESTORE_DB;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Story'), where('timestamp', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000))),
      (snapshot) => {
        const stories = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        // Filter out documents with duplicate usernames
        const uniqueStories = stories.filter((story, index, self) =>
          index === self.findIndex((s) => s.data.username === story.data.username)
        );
        setStoryInfo(uniqueStories);
      }
    );
  
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        // Navigate to story details or handle the press event
        navigation.navigate('Status', { name: item.data.username, uid: item.data.uid, profileImg: item.data.profileImg });
      }}
    >
      <View style={{ flexDirection: 'column', alignItems: 'center', height: 100, justifyContent: 'center', marginLeft: 20 }}>
      <Avatar.Icon icon="account-circle" size={50} style={{ top: 14, backgroundColor: '#1C1441', position: 'absolute' }} color={'#FFF'} />
  <Image
    source={{ uri: item.data.profileImg }}
    style={{ width: 50, height: 50, borderRadius: 30 }}
  />
  <Text style={{ marginTop: 5, fontSize: 12 }}>{item.data.username}</Text>
</View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={storyInfo}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      horizontal
      style={{ height: storyInfo.length > 0 ? 110 : 0 }}
    />
  );
};

export default Store;