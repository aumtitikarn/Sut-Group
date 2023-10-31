import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../firestore";
import { StatusBar } from "expo-status-bar";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);

  const user = useSelector((state) => state.user.user);

  const sendAMessage = async () => {
    const timeStamp = serverTimestamp();
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };

    setMessage("");

    try {
      await addDoc(
        collection(doc(FIRESTORE_DB, "chats", room._id), "messages"),
        _doc
      );
    } catch (error) {
      alert(error);
    }
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(FIRESTORE_DB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapShot) => {
      const updatedMessages = querySnapShot.docs.map((doc) => doc.data());
      setMessages(updatedMessages);
      setisLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <View style={styles.profileIcon}>
              <FontAwesome name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text style={styles.profileName}>
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
              </Text>
              <Text style={styles.profileStatus}>online</Text>
            </View>
          </View>
          <View style={styles.icons}></View>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <ScrollView>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={"large"} color={"#43C651"} />
            </View>
          ) : (
            messages?.map((msg) => (
              <View
                key={msg._id}
                style={
                  msg.user?.providerData?.email === user?.providerData?.email
                    ? styles.sentMessageContainer
                    : styles.receivedMessageContainer
                }
              >
                <View
                  style={
                    msg.user?.providerData?.email === user?.providerData?.email
                      ? styles.sentMessageContent
                      : styles.receivedMessageContent
                  }
                >
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.timestampText}>
                    {msg?.timeStamp?.seconds &&
                      new Date(parseInt(msg?.timeStamp?.seconds) * 1000).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={180}
      >
        <TextInput
          style={styles.input}
          placeholder="Type here.."
          placeholderTextColor={"#FDF4E2"}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity onPress={sendAMessage}>
          <FontAwesome name="send" size={24} color="#FDF4E2" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    width: "100%",
    backgroundColor: "#8AD1DB",
    padding: 6,
    flex: 0.25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 12,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    color: "#fbfbfb",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  profileStatus: {
    color: "#fbfbfb",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 3,
  },
  messageContainer: {
    flex: 1,
    backgroundColor: "#FDF4E2",
    padding: 6,
    borderTopLeftRadius: 50,
    marginTop: -10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  receivedMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  receivedMessageContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginLeft: 16,
    padding: 8,
  },
  sentMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sentMessageContent: {
    backgroundColor: "#8AD1DB",
    borderRadius: 10,
    marginRight: 16,
    padding: 8,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1441",
  },
  timestampText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 20,
    backgroundColor: "#8AD1DB",
    borderRadius: 20,
  },
  input: {
    flex: 1,
    height: 32,
    fontSize: 16,
    color: "#1C1441",
    fontWeight: "bold",
  },
};

export default ChatScreen;
