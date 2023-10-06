import React from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // นำเข้า useNavigation
import Search from '../components/Searchbar';
import Post from '../components/Post';

const MyComponent = () => {
  const navigation = useNavigation(); // ใช้ useNavigation สร้างตัวแปรนำทาง

  const handleCreatePostPress = () => {
    // ใช้ navigation.navigate เพื่อนำทางไปยังหน้า createpost.js
    navigation.navigate('Createpost');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Appbar.Header style={{ backgroundColor: '#FFBD59' }}>
          <Image style={styles.logo} source={require('../assets/pro-sut.png')} />
          <Appbar.Content title="Home" style={{ marginRight: 50 }} />
          <Appbar.Action
            icon="bell"
            style={{ marginLeft: 10 }}
            onPress={() => navigation.navigate('NotiScreen')}
          />
        </Appbar.Header>
        <Search style={styles.search} />
        <View>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              borderWidth: 1,
              backgroundColor: '#FFBD59',
              width: 90,
              padding: 10,
              marginTop: 25,
              marginLeft: 290,
            }}
            onPress={handleCreatePostPress} // เมื่อปุ่มถูกกด
          >
            <Text>สร้างโพสต์</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 12 }}>
          <Post />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6DE',
  },
  logo: {
    height: 50,
    width: 100,
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
