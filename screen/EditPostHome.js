import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const EditPostHome = ({ route, navigation }) => {
  const { postId } = route.params;
  const [feed, setFeed] = useState('');
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  console.log('ค่า param ที่ต้องการแก้ไข >> ',postId)

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
      <View>
        <MaterialCommunityIcons 
          name="arrow-left-thick"  
          size={50} 
          style={{ margin: 10 }} 
          onPress={() => navigation.navigate('Profile')} 
        />
      </View>
      <Text style={{ left: 70, top: -50, fontWeight: 'bold', fontSize: 24 }}>แก้ไขโพสต์</Text>
      <View style={{ top: -20, left: 20 }}>
        <Avatar.Icon icon="account-circle" size={80} />
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
          <Text style={styles.buttonText}>โพสต์</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
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
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 275,
    padding: 5,
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 6,
    left: -5
  },
});

export default EditPostHome;