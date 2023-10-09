import  React from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TextInput, Button, View, Image,ScrollView,TouchableOpacity, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Shop from '../components/shop';
import SelectDropdown from 'react-native-select-dropdown';

import { useNavigation } from '@react-navigation/native';


const type = ["ทั้งหมด", "คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]

export default function MyComponent({navigation}) {
  const navigation = useNavigation(); 
  const handleMarketPostPress = () => {
   
    navigation.navigate('marketpost');

  };

  return(
    <View style={styles.conter}>
    <Appbar.Header style={{backgroundColor:'#FFBD59', height: 40, top:-15}} >
      <Image style={styles.logo} source={require('../assets/pro-sut.png')}  />
      <Appbar.Content title=" Marketplace" style={{
      marginLeft: 50}} />
      <Appbar.Action icon="bell" onPress={() => {}} />
      
    </Appbar.Header>
    <Searchbar style={styles.search} placeholder="Search" />
    <View style={{ top: 20,
      marginRight: 10,
      marginLeft: 25,}} >
     <Ionicons name="filter" size={30}  />
    </View>
     <View>
            <TouchableOpacity
              style={{
                borderRadius: 5,
                borderWidth: 1,
                backgroundColor: '#FFBD59',
                width: 90,
                padding: 10,
                top: 40,
                marginLeft: 30,
              }}
              
            >
              <Text onPress={handleMarketPostPress} >สร้างสินค้า</Text>
            </TouchableOpacity>
          </View>
    <View style={styles.loginButton}>
    <SelectDropdown
    data={type}
    defaultButtonText="ประเภทสินค้า" // เปลี่ยนค่าเริ่มต้นที่นี่
    onSelect={(selectedItem, index) => {
      console.log(selectedItem, index);
    }}
    buttonTextAfterSelection={(selectedItem, index) => {
      return selectedItem;
    }}
    rowTextForSelection={(product, index) => {
      return product;
    }}
  />
    </View>
    <ScrollView>
    <View style={{
      marginTop: 12
     }}>
     <Shop  />
    </View>
    </ScrollView>
    </View>
  );

} 

const styles = StyleSheet.create({
conter:{
  flex: 1,
    backgroundColor: '#FFF6DE',
    paddingTop: StatusBar.currentHeight
    
},
logo: {
    height: 50,
    width: 100,
    
  },
  search:{backgroundColor: '#FFF',
    borderRadius: 30,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,},
    
loginButton:{
    top: -60,
    marginLeft:70,
   }
 
});