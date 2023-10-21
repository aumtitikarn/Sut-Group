import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Button, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { FIREBASE_AUTH } from '../firestore';
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import  Createpost  from './createpost';
import PostProfile from '../components/postProfile';
import UserData from '../components/userData';

  const Profile = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  

  const handleLogout = async () => {
    signOut(auth).then(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }).catch((error) => {
      console.log(error.message);
    });
  };  


 const handleCreatePostPress = () => {
    navigation.navigate('Createpost');
  
  };

  return (
  <SafeAreaView style={styles.container}>
  <ScrollView>
  <View>
      <Image source={require('../assets/grey.jpg')} 
      style={{width: 450, height: 150}}
      />
  </View>
    <View  style={{
      top: -70, // ปรับตำแหน่งตามที่คุณต้องการ
      left: 110, // ปรับตำแหน่งตามที่คุณต้องการ
    }}>
    <UserData />
    </View>
    <View style={{
      top: -60, 
      left: 10
    }}>
    <TouchableOpacity style={styles.buttonYellow} onPress={() => navigation.navigate('EditProfile')}>
      <Text style={styles.buttonText}>แก้ไขโปรไฟล์</Text>
    </TouchableOpacity>
    </View>
    <View style={{
      top: -101,
      left: 130
    }}>
    <TouchableOpacity style={{borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 85,
    padding: 8,
    }}
    onPress={handleCreatePostPress}
    >
      <Text>สร้างโพสต์</Text>
    </TouchableOpacity>
    </View>
     <View style={{
      top: -142, 
      left: 235
    }}>
    <TouchableOpacity style={{borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FAE86C',
    width: 70,
    padding: 8,
    top:5}} onPress={handleLogout}>
      <Text style={styles.buttonText}>Log out</Text>
    </TouchableOpacity>
    </View>
    <View style={{
      top :-130
    }}>
    <PostProfile />
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF6DE',
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 100,
    padding: 8,
    margin: 5
  },
});
  export default Profile