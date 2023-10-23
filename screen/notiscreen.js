import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Noti from '../components/noti'
const Home = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <MaterialCommunityIcons 
          name="arrow-left-thick"  
          size={50} style={{ margin: 10 }} 
          onPress={() => navigation.goBack()} 
        />
        <View style={{left:80, top:-45}}>
        <Text style={{ fontWeight: 'bold'}}>Notification</Text>
        </View>
      </View>
      <Noti />
      <View style={{top:-330}}>
      <Noti  />
      </View>
      <View style={{top:-290}}>
      <Noti  />
      </View>
      <View style={{top:-250}}>
      <Noti  />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
  }
});

export default Home;
