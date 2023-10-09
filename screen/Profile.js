import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Button, SafeAreaView, ScrollView,StatusBar } from 'react-native';
import { FIREBASE_AUTH } from 'firebase/app';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import  Createpost  from './createpost';
import PostHome from '../components/PostHome';

  const Profile = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error(error);
    }
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
  <View
   style={{
      position: 'absolute',
      top: 120,
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={80} />
    </View>
    <View  style={{
      position: 'absolute',
      top: 150, // ปรับตำแหน่งตามที่คุณต้องการ
      left: 110, // ปรับตำแหน่งตามที่คุณต้องการ
    }}>
    <Text style={{fontWeight: 'bold', padding:5}}>PHORNTHI</Text>
    <TouchableOpacity style={{
    borderRadius: 30,
    backgroundColor: '#FFF',
    width: 200,
    height: 30,
    padding: 2,
    borderWidth: 1,
    borderColor: 'black'
    }}>
    <Text >#สำนักวิชาศาสตร์และศิลป์ดิจิทัล</Text>
    </TouchableOpacity>
    </View>
    <View style={{
      position: 'absolute',
      top: 220, 
      left: 10
    }}>
    <TouchableOpacity style={styles.buttonYellow}>
      <Text style={styles.buttonText}>แก้ไขโปรไฟล์</Text>
    </TouchableOpacity>
    </View>
    <View style={{
      position: 'absolute',
      top: 225,
      left: 130
    }}>
    <TouchableOpacity style={{borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 90,
    padding: 8,
    }}
    onPress={handleCreatePostPress}
    >
      <Text>สร้างโพสต์</Text>
    </TouchableOpacity>
    </View>
     <View style={{
      position: 'absolute',
      top: 220, 
      left: 235
    }}>
    <TouchableOpacity style={{borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FAE86C',
    width: 70,
    padding: 8,
    top:5}} onPress={handleLogout}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
    </View>
    <View style={{
      top: 120,
    }}>
    <PostHome />
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
