import React, { useState, useEffect } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { onAuthStateChanged } from 'firebase/auth';
import Search from '../components/Searchbar';
import PostHome from '../components/PostHome';

const MyComponent = () => {
  const navigation = useNavigation(); 

  const handleCreatePostPress = () => {
   
    navigation.navigate('Createpost');

  };

  return (
    <SafeAreaView style={styles.container}>
        <Appbar.Header style={{ backgroundColor: '#FDF4E2'  , height: 30, top:-15}}>
          <Image style={styles.logo} source={require('../assets/2.png')} />
          <Appbar.Content title="Home" style={{ marginLeft : 75 }} />
          <Appbar.Action
            icon="bell"
            style={{ marginLeft: 10 }}
            onPress={() => navigation.navigate('NotiScreen')}
          />
        </Appbar.Header>
        <ScrollView>
        <Search style={styles.search} />
        <View>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              borderWidth: 2,
              backgroundColor: '#FDF4E2',
              width: 90,
              padding: 10,
              marginTop: 25,
              marginLeft: 290,
            }}
            onPress={handleCreatePostPress} // เมื่อปุ่มถูกกด
          >
            <Text style={{color:"#1C1441"}}>สร้างโพสต์</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12 }}>
        <PostHome />
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight,
  },
  logo: {
    height: 50,
    width: 100,
    top:-5
  },
  search: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
  },
});

export default MyComponent;
