import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, TextInput, Image, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Entypo, FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { firestoreDB } from "firestore";
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
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => alert(err));
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
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
    <SafeAreaView style={styles.AndroidSafeArea}>
      <View style={{ flex: 1 }}>
        {/* top */}
        <View style={{ width: "100%", backgroundColor: "#FFBD59", padding: 6, flex: 0.25 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", padding: 12 }}>
            {/* go back */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
            </TouchableOpacity>

            {/*  profile */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginRight: 3 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: "white", alignItems: "center", justifyContent: "center" }}>
                <FontAwesome5 name="users" size={24} color="#fbfbfb" />
              </View>

              <View>
                <Text style={{ color: "#fbfbfb", fontSize: 16, fontWeight: "bold", textTransform: "capitalize" }}>
                  {room.chatName.length > 16 ? `${room.chatName.slice(0, 16)}..` : room.chatName}
                </Text>
                <Text style={{ color: "#fbfbfb", fontSize: 14, fontWeight: "bold", textTransform: "capitalize" }}>
                  online
                </Text>
              </View>
            </View>

            {/* icons */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 3 }}>
              
            </View>
          </View>
        </View>

        {/* bottom section */}
        <View style={{ width: "100%", backgroundColor: "white", padding: 6, borderBottomLeftRadius: 50, flex: 1, marginTop: -10 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={180}
          >
            <>
              <ScrollView>
                {isLoading ? (
                  <>
                    <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                      <ActivityIndicator size={"large"} color={"#43C651"} />
                    </View>
                  </>
                ) : (
                  <>
                    {messages?.map((msg) => (
                      <View key={msg._id} style={{ margin: 1 }}>
                        <View
                          style={{ alignSelf: "flex-end",paddingHorizontal: 4, paddingVertical: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomLeftRadius: 20, backgroundColor: "#FFBD59", width: "auto", position: "relative" }}
                        >
                          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#FBE5AD" }}>
                            {msg.message}
                          </Text>
                        </View>

                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text style={{ fontSize: 12, fontWeight: "bold", color: "black" }}>
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </ScrollView>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 8, marginVertical: 2 }}>
                <View style={{ backgroundColor: "gray", borderRadius: 20, paddingHorizontal: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <TouchableOpacity>
                    <Entypo name="emoji-happy" size={24} color="#555" />
                  </TouchableOpacity>

                  <TextInput
                    style={{ flex: 1, height: 32, fontSize: 16, color: "#FFBD59", fontWeight: "bold" }}
                    placeholder="Type here.."
                    placeholderTextColor={"#999"}
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                  />
                  <TouchableOpacity>
                    {/*<Entypo name="mic" size={24} color="#43C651" />*/}
                  </TouchableOpacity>
                </View>

                {/* send icon */}
                <TouchableOpacity style={{ paddingLeft: 4 }} onPress={sendAMessage}>
                  <FontAwesome name="send" size={24} color="#555" />
                </TouchableOpacity>
              </View>
            </>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "#FBE5AD",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
};

export default ChatScreen;
