import React, { useState, useEffect } from 'react';
import { Appbar,Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TextInput,  View, Image,ScrollView,TouchableOpacity, StatusBar,SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostShop from '../components/PostShop';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';



    

export default function MyComponent() {
  
  const navigation = useNavigation(); 

  const navigateToWheel = () => {
    navigation.navigate('Wheel');
  };
  return(
    <SafeAreaView style={styles.conter}>
    <Appbar.Header style={{backgroundColor:'#FDF4E2', height: 40, top:-15}} >
      <Image style={styles.logo} source={require('../assets/2.png')}  />
      <Appbar.Content title="ร้านค้า" style={{ left: 70 }} />
      <MaterialCommunityIcons
          name="view-carousel"
          color='black' // You should define 'color' here or replace it with a specific color value
          size={40}
          left={-25}
          top={1}
          onPress={() => navigateToWheel()} // Navigate to 'Wheel' screen when pressed
        />
    </Appbar.Header> 
    <ScrollView style={{flex:1}}>
    <View style={{ top: 20,
      marginRight: 10,
      marginLeft: 25,}} >
     <Ionicons name="filter" size={30}  />
     <PostShop />
 </View>
    </ScrollView>
    </SafeAreaView>
  );

} 

const styles = StyleSheet.create({
conter:{
    height:900,
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight
    
},
logo: {
    height: 50,
    width: 100,
    
  },
  search:{backgroundColor: '#FFF',
    borderWidth: 2,
    borderRadius: 30,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,},
    
loginButton:{
    top: -60,
    marginLeft:270, 
   }
 
});
