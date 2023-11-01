import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const EditPostHome = ({ route, navigation }) => {
  const { postId } = route.params;
  const [feed, setFeed] = useState('');
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          // ดึงข้อมูลโพสต์จาก Firestore โดยใช้ postId
          const allpostHomeRef = doc(db, 'allpostHome', postId);

          const allpostHomeSnapshot = await getDoc(allpostHomeRef);

          if (allpostHomeSnapshot.exists()) {
            const allpostHomeData = allpostHomeSnapshot.data();

            if (allpostHomeData) {
              setFeed(allpostHomeData.text);
              setImageUrl(allpostHomeData.profileImg);
             console.log(allpostHomeData.profileImg);
  
            }
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ', error);
      }
    };

    fetchData();
  }, [postId, auth.currentUser]);

  const handleUpdatePost = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // ทำการอัปเดตโพสต์ใน Firestore ด้วยค่าใหม่ที่อยู่ใน "feed"
        const allpostHomeRef = doc(db, 'allpostHome', postId);
        await setDoc(allpostHomeRef, { text: feed }, { merge: true });

        // เปลี่ยนโพสต์ใน postHome ใน "users" collection ด้วยขั้นตอนเดียวกันที่คุณใช้ใน allpostHome collection
        const postHomeRef = doc(db, 'users', user.uid, 'postHome', postId);
        await setDoc(postHomeRef, { text: feed }, { merge: true });

        // เปลี่ยนโพสต์เสร็จแล้วทำอย่างอื่น (เช่น แสดงข้อความยืนยัน)
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเปลี่ยนโพสต์: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{left:25, top: 5,}} >
    <MaterialCommunityIcons 
      name="arrow-left"  
      size={35} style={{margin:10}} 
      onPress={() => navigation.goBack()}
      />
    </View>
      <Text style={{ left: 90, top: -40, fontWeight: 'bold', fontSize: 24 }}>แก้ไขโพสต์</Text>
      <View style={{ top: -20, left: 20 }}>
        <Avatar.Icon icon="account-circle" size={80}  style={{ backgroundColor:'orange',}} color={'#FFF'}/>
        {imageUrl && (
       <Image
          source={{ uri: imageUrl }}
          style={{ width: 80, height:80,  borderRadius: 50, position: 'absolute' }}
      />
      )}
      </View>
      <View style={{ top: -90, left: 110 }}>
        <TextInput
          style={styles.input}
          placeholderTextColor="Black"
          textAlignVertical="top" 
          multiline={true}
          value={feed}
          onChangeText={(text) => setFeed(text)}
        />
        <TouchableOpacity style={styles.buttonYellow} onPress={handleUpdatePost}>
          <Text style={{ color: "#1C1441"}}>โพสต์</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight 
  },
  input: {
    height: 200,
    width: 275,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: '#FFF'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    top: -50,
    marginLeft: 105
  },
  icon: {
    marginRight: 10,
  },
  buttonYellow: {
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: '#FDF4E2',
    width: 275,
    padding: 5,
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 6,
    left: -5
  },
});

export default EditPostHome;