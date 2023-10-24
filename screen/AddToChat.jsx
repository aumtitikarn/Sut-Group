import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "firestore";

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
      setDoc(doc(firestoreDB, "chats", id), _doc)
        .then(() => {
          setAddToChat("");
          navigation.navigate("HomeScreen");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <View className="flex-1">
      {/* top */}
      <View className="w-full bg-primary px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>

          {/* user profiule */}
          <View className="flex-row items-center justify-center space-x-3">
            
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* icons */}
            <Ionicons name="chatbubbles" size={24} color={"#777"} />
            {/* textinput */}
            <TextInput
              placeholder="Create aa chat"
              placeholderTextColor={"#999"}
              value={addToChat}
              onChangeText={(text) => setAddToChat(text)}
              className="flex-1 text-lg text-primaryText -mt-2 h-12 w-full"
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
