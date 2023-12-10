import React from 'react';
import { View, Text,  SafeAreaView ,StyleSheet,ScrollView ,Image} from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import User from '../datachat/user';

export default function Chat (){


  return (
    <SafeAreaView style={styles.container}>
  <Appbar.Header style={{ backgroundColor: '#FDF4E2'  , height: 30, top:-15}}>
          <Image style={styles.logo} source={require('../assets/2.png')} />
        </Appbar.Header>
        <ScrollView>
       <User />
        </ScrollView>
    </SafeAreaView>
  );
 
}
 const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor:'#fff5e2'
    },
    logo: {
      height: 50,
      width: 100,
      top:5,
      left:130
    }
  })


