import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Image,
  StyleSheet,
  Platform // Make sure to import StyleSheet
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from '../firestore';
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Appbar } from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight = 40,
  },
  header: {
    backgroundColor: '#FDF4E2',
    height: 100,

  },
  logo: {
    height: 50,
    width: 100,
    top: -5,
  },
  chatContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 2,
  },
  chatImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    padding: 1,
    justifyContent: 'center',
    backgroundColor: '#FDF4E2'
  },
  chatContent: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 4,
    backgroundColor: '#FDF4E2',
    borderRadius: 10,
    padding: 10,
  },
  chatTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  chatMessage: {
    color: 'blue',
    fontSize: 14,
  },
  chatTimestamp: {
    color: 'blue',
    fontSize: 14,
  },
});

const ChatHomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(FIRESTORE_DB, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    // Return the unsubscribe function to stop listening to the updates
    return unsubscribe;
  },);

 

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

      <Appbar.Header style={{ backgroundColor: '#FDF4E2'  , height: 30, top:-15}}>
          <Image style={styles.logo} source={require('../assets/2.png')} />
          <Appbar.Content title="ข้อความ" style={{ left: 65 }} />
          <TouchableOpacity
              onPress={() => navigation.navigate('AddToChat')}
              style={{}}
            >
              <Ionicons 
              name="chatbox" 
              size={30} color="#555"
              style={{ marginLeft: -50 }} 
                />
            </TouchableOpacity>
        </Appbar.Header>
       
      </View>

      <ScrollView>
        <View>
          <View>
            
          </View>

          {isLoading ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#43C651" />
            </View>
          ) : chats && chats?.length > 0 ? (
            chats.map((room) => (
              <ChatRoom key={room._id} room={room} />
            ))
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ChatRoom = ({ room }) => {
  const navigation = useNavigation();

  const latestMessage = Array.isArray(room.messages) && room.messages.length > 0
    ? room.messages[room.messages.length - 1]
    : null;

  const timestamp = latestMessage
    ? formatDistanceToNow(new Date(latestMessage.timeStamp.toDate()), {
      addSuffix: true,
    })
    : '';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ChatScreen', { room: room })}
      style={styles.chatContainer}
    >
      <View style={styles.chatImage}>
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      <View style={styles.chatContent}>
        <Text style={styles.chatTitle}>
          {room.chatName}
        </Text>
        <Text style={styles.chatMessage}>
          {latestMessage ? latestMessage.message : 'No message'}
          
        </Text>
        
        <Text style={styles.chatTimestamp}>
          {timestamp}
          
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatHomeScreen;
