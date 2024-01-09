import React, { useState, useEffect } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { onAuthStateChanged } from 'firebase/auth';
import PostHome from '../components/PostHome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Store from '../components/store';
import Fab from '../components/fab';

const MyComponent = () => {
  const navigation = useNavigation(); 

  const navigateToWheel = () => {
    navigation.navigate('Wheel');
  };

  return (
    <SafeAreaView style={styles.container}>
        <Appbar.Header style={{ backgroundColor: '#FDF4E2'  , height: 30, top:-15}}>
          <Image style={styles.logo} source={require('../assets/2.png')} />
          <Appbar.Content title="หน้าหลัก" style={{ left: 65 }} />
          <MaterialCommunityIcons
          name="view-carousel"
          color='black' // You should define 'color' here or replace it with a specific color value
          size={40}
          left={-15}
          top={-8}
          onPress={() => navigateToWheel()} // Navigate to 'Wheel' screen when pressed
        />
        </Appbar.Header>
        {/* <Store /> */}
        <ScrollView>
        <PostHome />
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </ScrollView>
      <View style={{top: -50, left: 30}}>
        <Fab />
        </View>
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
