import React, { useState, useEffect } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';
import { Text, StyleSheet, TouchableOpacity, View, Image, SafeAreaView, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { onAuthStateChanged } from 'firebase/auth';
import Searchba from '../components/Searchbar';
import PostHome from '../components/PostHome';

const MyComponent = () => {
  const navigation = useNavigation(); 
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearching(true);
    console.log('Search results:', results);
  };

  const handleCreatePostPress = () => {
    navigation.navigate('Createpost');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#FDF4E2'  , height: 30, top:-15}}>
        <Image style={styles.logo} source={require('../assets/2.png')} />
        <Appbar.Content title="Home" style={{ left: 65 }} />
        <Appbar.Action
          icon="bell"
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate('NotiScreen')}
        />
      </Appbar.Header>
      <Searchba style={styles.search} onSearchResults={handleSearchResults} />
      <View>
        <TouchableOpacity
          style={{
            borderRadius: 5,
            borderWidth: 2,
            backgroundColor: '#FDF4E2',
            width: 90,
            padding: 10,
            marginTop: 25,
            marginLeft: 290,
          }}
          onPress={handleCreatePostPress} // เมื่อปุ่มถูกกด
        >
          <Text style={{color:"#1C1441"}}>สร้างโพสต์</Text>
        </TouchableOpacity>
      </View>
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePostPress(item)}>
              <PostHome item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <PostHome/>
      )}
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
