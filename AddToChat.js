import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../firestore';
import { useNavigation } from "@react-navigation/native";

const AddToChat = () => {
  const user = useSelector((state) => state.user.user);
  const [addToChat, setAddToChat] = useState("");
  const navigation = useNavigation();

  const createNewChat = async () => {
    let id = `${Date.now()}`;

    const _doc = {
      _id: id,
      user: user,
      chatName: addToChat,
    };

    if (addToChat !== "") {
      setDoc(doc(FIRESTORE_DB, "chats", id), _doc)
        .then(() => {
          setAddToChat("");
          navigation.navigate("ChatHomeScreen");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* top */}
      <View style={{ backgroundColor: "primary", padding: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="#fbfbfb" />
          </TouchableOpacity>

          {/* user profile */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              space: 3,
            }}
          >
            {/* Add user profile information here */}
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View style={{ backgroundColor: "white", flex: 1, marginTop: -10 }}>
        <View style={{ padding: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "gray",
            }}
          >
            {/* icons */}
            <Ionicons name="chatbubbles" size={24} color="#777" />
            {/* textinput */}
            <TextInput
              placeholder="Create a chat"
              placeholderTextColor="#999"
              value={addToChat}
              onChangeText={(text) => setAddToChat(text)}
              style={{ flex: 1, fontSize: 16 }}
            />
            {/* icon */}
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChat;
