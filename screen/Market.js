import React, { useState, useEffect } from 'react';
import { Appbar,Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TextInput,  View, Image,ScrollView,TouchableOpacity, StatusBar,SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostShop from '../components/PostShop';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Search from '../components/Search';


    

export default function MyComponent() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [typ, setType] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearching(true);
    console.log('Search results:', results);
  };

  const handleMarketPost = () => {
   
    navigation.navigate('Marketpost');

  };
  


  return(
    <SafeAreaView style={styles.conter}>
    <Appbar.Header style={{backgroundColor:'#FDF4E2', height: 40, top:-15}} >
      <Image style={styles.logo} source={require('../assets/2.png')}  />
      <Appbar.Content title="ร้านค้า" style={{ left: 70 }} />
    </Appbar.Header> 
    <Search  onSearchResults={handleSearchResults} />
    <ScrollView>
    <View style={{ top: 80,
      marginRight: 10,
      marginLeft: 25,}} >
     <Ionicons name="filter" size={30}  />
    </View>
     <View>
          
          </View>
    <View style={styles.loginButton}> 
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
 <View>
 <PostShop/>
 </View>
    </ScrollView>
    </SafeAreaView>
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
    marginLeft:270, 
   }
 
});
