import React from 'react';
import { View,
    Text,  
    SafeAreaView, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity,
    StatusBar,
    Image,
   Platform,
   Alert, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Comment = () => {
   const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params.postId; 
  console.log(postId);

  return (
    <SafeAreaView style={styles.container}>
    <View>
        <MaterialCommunityIcons 
          name="arrow-left-thick"  
          size={50} style={{margin:10, top: 20}} 
         onPress={() => navigation.goBack()}
          />
        </View>
    <View>
      <Text>รายละเอียดของโพสต์ที่คุณเลือก (postId: {postId})</Text>
      {/* ทำสิ่งที่คุณต้องการด้วย postId ที่ได้รับมา */}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fffae8',
      paddingTop: StatusBar.currentHeight 
    },
  });

export default Comment;
