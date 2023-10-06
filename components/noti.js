import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ top: 10, left: 20 }}>
        <Avatar.Icon icon="account-circle" size={70} />
      </View>
      <View style={{ position: 'absolute', left: 110 }}>
        <Text style={{ fontWeight: 'bold', padding: 5 }}>PHORNTHI</Text>
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
        <Text style={{ marginLeft: 10, margin: 10, fontWeight: 'bold' }}>ถูกใจโพสต์ของคุณ</Text>
        <View style={{
          background: '#000',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          width: 372, 
          height: 1,
          left: -90
        }}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
  },
});

export default Home;
