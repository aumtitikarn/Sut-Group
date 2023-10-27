import React, { useState, useEffect } from 'react';
import { View, Text,Card,ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const loadFirestoreData = async () => {
    const db = getFirestore();
    const postShopCollection = collection(db, 'allpostHome');
    const q = query(postShopCollection, where('faculty', '==', searchQuery));

    const querySnapshot = await getDocs(q);
    const postShopData = [];

    querySnapshot.forEach((doc) => {
      postShopData.push({ id: doc.id, ...doc.data() });
    });

    setFilteredData(postShopData);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadFirestoreData();
  };

  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
     
      {filteredData.map((item) => (
        
        <Text style={{left:20}} key={item.id}>{item.name}</Text>
     
      ))}
     
    </View>
  );
};

export default Search;
