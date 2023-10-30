import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {FIRESTORE_DB} from '../firestore';
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { StyleSheet, Platform, StatusBar } from "react-native";

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
  }, []);

  const styles = StyleSheet.create({
    AndroidSafeArea: {
      flex: 1,
      backgroundColor: "#FBE5AD",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  });

  return (
    <View style={styles.AndroidSafeArea}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 4,
          paddingVertical: 2,
        }}
      >
        {/* Top UI elements here */}
      </View>

      <ScrollView
        style={{ flex: 1, paddingTop: 10, paddingHorizontal: 4 }}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Text
              style={{
                color: "blue",
                fontSize: 20,
                fontWeight: "bold",
                paddingBottom: 2,
              }}
            >
              Message
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("AddToChat")}
            >
              <Ionicons name="chatbox" size={28} color="#555" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#43C651" />
            </View>
          ) : chats && chats?.length > 0 ? (
            chats.map((room) => (
              <MessageCard key={room._id} room={room} />
            ))
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 2,
      }}
    >
      {/* images */}
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "blue",
          padding: 1,
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* title */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: 4,
        }}
      >
        <Text
          style={{
            color: "#333",
            fontSize: 20,
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {room.chatName}
        </Text>
        <Text style={{ color: "blue", fontSize: 14 }}>
          Lorem ipsum dolor sit amet consec tetur adipis adip isicing icing
          elit....
        </Text>
      </View>

      {/* timestamp */}
      <Text
        style={{
          color: "blue",
          paddingHorizontal: 4,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        27 Min
      </Text>
    </TouchableOpacity>
  );
};

export default ChatHomeScreen;
