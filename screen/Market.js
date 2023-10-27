import React, { useState, useEffect } from 'react';
import { Appbar,Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TextInput,  View, Image,ScrollView,TouchableOpacity, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostShop from '../components/PostShop';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


    const type = ["ทั้งหมด", "คอม", "อุปกรณ์ไฟฟ้า", "เครื่องเขียน", "อาหาร", "ของใช้", "เครื่องครัว", "หนังสือ", "อุปกรณ์ไอที"]

export default function MyComponent() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadFirestoreData = async () => {
    const db = getFirestore();
    const shopCollection = collection(db, 'allpostShop');
    const q = query(shopCollection, where('name', '==', searchQuery));
    const querySnapshot = await getDocs(q);
    const shopData = [];
  
    querySnapshot.forEach((doc) => {
      shopData.push({ id: doc.id, ...doc.data() });
    });
  
    setSearchResults(shopData);
    setIsSearching(true);
  };
  useEffect(() => {
    if (searchQuery) {
      loadFirestoreData();
    }
  }, [searchQuery]);
  const handleMarketPost = () => {
   
    navigation.navigate('Marketpost');

  };
  


  return(
    <View style={styles.conter}>
    <Appbar.Header style={{backgroundColor:'#FDF4E2', height: 40, top:-15}} >
      <Image style={styles.logo} source={require('../assets/2.png')}  />
      <Appbar.Content title=" Marketplace" style={{ right: 20}} />
      <Appbar.Action icon="bell"  onPress={() => navigation.navigate('NotiScreen')} />
      
    </Appbar.Header> 
   
    <ScrollView>
    <Searchbar
  placeholder="Search"
  onChangeText={(query) => setSearchQuery(query)} // เรียกฟังก์ชันเมื่อเปลี่ยนแปลงคำค้นหา
/>
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
                backgroundColor: '#FDF4E2',
                width: 90,
                padding: 10,
                top: 40,
                marginLeft: 30,
              }}
              
            >
              <Text onPress={handleMarketPost} >สร้างสินค้า</Text>
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
    {isSearching ? (
  searchResults.map((shop) => (
    <View key={shop.id} style={{ marginTop: 12 }}>
      <PostShop shop={shop} />
    </View>
  ))
) : (
          // ถ้ายังไม่มีการค้นหา ให้แสดงโพสต์ทั้งหมด
          <PostShop />
        )}
    </ScrollView>
    </View>
  );

} 

const styles = StyleSheet.create({
conter:{
  flex: 1,
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
    marginLeft:70, 
   }
 
});
