import React, { useState, useEffect } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import products from '../components/DataShop';
import Shop from '../components/shop';
import { useNavigation } from '@react-navigation/native';

export default function MyComponent() {
const [sele, setSele] = useState('all');
 // เริ่มต้นเลือกทั้งหมด
const navigation = useNavigation();

  const handleLovePress = () => {
    navigation.navigate('marketpost');
  };


  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#FFBD59' }}>
        <Image style={styles.logo} source={require('../assets/pro-sut.png')} />
        <Appbar.Content title=" ขายของ" style={{ alignItems: 'center' }} />
        <Appbar.Action icon="bell" onPress={() => {}} />
      </Appbar.Header>
      <Searchbar style={styles.search} />
      <View style={styles.filterContainer}>
      <TouchableOpacity>
        <Ionicons name="filter" size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderRadius: 5,
            borderWidth: 1,
            backgroundColor: '#FFBD59',
            width: 90,
            padding: 10,
          }} > 
          <Text  onPress={handleLovePress} >สร้างโพสต์</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryContainer}>
        <Text>ประเภทสินค้า</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.productsContainer}>
          <Shop products={products} />
        </View>
      </ScrollView>
    </View>
  );
}
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
    marginHorizontal: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginTop: 1,
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  productsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
